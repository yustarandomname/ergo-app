import { error } from '@sveltejs/kit';
import { parse } from 'node-html-parser';
import { PUBLIC_API_URL, PUBLIC_ANON_KEY } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';

import type { RequestHandler } from './$types';
import type { Database } from '$lib/database.types';

const supabase = createClient<Database>(PUBLIC_API_URL, PUBLIC_ANON_KEY);

type Rower = Database['public']['Tables']['rowers']['Row'];
type RowerConcept = Omit<Rower, 'created_at' | 'team_id'>;

// interface Rower {
// 	name: string;
// 	url: string;
// 	age: number;
// 	country: string;
// }

/**
 * get the rowers from a team page
 * @param teamId id: number of the team to get the rowers from
 * @returns return a list of rowers
 * @throws error if the team page is not found
 * @throws error if a rower is not formatted as expected
 */
async function getTeamTable(teamId = 17833): Promise<RowerConcept[]> {
	const teamPage = await fetch(`https://log.concept2.com/team/${teamId}`);
	const teamPageText = await teamPage.text();
	const teamPageDom = parse(teamPageText);

	const teamTable = teamPageDom?.querySelector('.js-tablesort > tbody');

	if (!teamTable) throw error(404, `Could not find team ${teamId}`);

	const rowers = [...teamTable.querySelectorAll('tr')].map((row): RowerConcept => {
		const name = row.querySelector('td:nth-child(1) > a')?.textContent;
		const url = row.querySelector('td:nth-child(1) > a')?.getAttribute('href');
		const country = row.querySelector('td:nth-child(4)')?.textContent;

		const id = parseInt(url?.split('/').pop() ?? '0');

		if (!id || !name || !url || !country) throw error(500, `Could not parse rower data for ${row}`);

		return { id, name, url, country };
	});

	return rowers;
}

async function selectRowersFromDB(teamId: number) {
	const { error: getRowerError, count } = await supabase
		.from('rowers')
		.select('id', { count: 'exact' })
		.eq('team_id', teamId);

	if (getRowerError) throw error(500, getRowerError.message);
	if (count === null) throw error(500, 'Could not get rowers from supabase');

	return count || 0;
}

async function insertRowersIntoDB(rowers: RowerConcept[], teamId: number) {
	const { error: insertRowerError } = await supabase
		.from('rowers')
		.insert(rowers.map((rower) => ({ ...rower, team_id: teamId })));

	if (insertRowerError) throw error(500, insertRowerError.message);
}

// Run only when time is between 12:00pm and 22:00pm
export const GET = (async ({ url }) => {
	if (new Date().getHours() < 12 || new Date().getHours() > 22) {
		return new Response(
			'API is not available at this time, check back between 12:00pm and 22:00pm'
		);
	}

	const teamId = parseInt(url.searchParams.get('team') ?? '0');

	if (teamId < 0) {
		throw error(400, 'team must be anumber, and must be positive');
	}

	const teamTable = await getTeamTable();
	const rowersInSupabase = await selectRowersFromDB(teamId);

	if (teamTable.length !== rowersInSupabase) {
		await insertRowersIntoDB(teamTable, teamId);
	}

	return new Response();
}) satisfies RequestHandler;
