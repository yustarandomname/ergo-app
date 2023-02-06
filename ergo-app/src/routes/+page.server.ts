import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { selectTeam } from '$lib/util/getTeam';

export const load = (async () => {
	const rowers = await selectTeam(17833);

	if (rowers.length) {
		return { rowers };
	}

	throw error(404, 'Not found');
}) satisfies PageServerLoad;
