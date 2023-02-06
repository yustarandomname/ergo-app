import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (({ params }) => {
	const { id } = params;
	const teamId = parseInt(id, 10);

	if (isNaN(teamId)) {
		throw error(404, 'Id must be an integer');
	}

	if (teamId < 0) {
		throw error(404, 'Id must be a positive integer');
	}

	return { teamId };
}) satisfies PageLoad;
