import { PUBLIC_ANON_KEY, PUBLIC_API_URL } from '$env/static/public';
import type { Database } from '$lib/database.types';
import { createClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

const supabase = createClient<Database>(PUBLIC_API_URL, PUBLIC_ANON_KEY);

type Rower = Database['public']['Tables']['rowers']['Row'];

export async function selectTeam(teamId: number): Promise<Rower[]> {
	const { data, error: getRowerError } = await supabase
		.from('rowers')
		.select('*')
		.eq('team_id', teamId);

	if (getRowerError) throw error(500, getRowerError.message);

	return data;
}
