import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { getAllTrainingsFor } from '$lib/util/getTrainings';

export const load = (async () => {
	const trainings = await getAllTrainingsFor(1789666);

	// TODO: if (trainings.length) {
	return { trainings };
	// }

	throw error(404, 'Not found');
}) satisfies PageServerLoad;
