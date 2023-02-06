import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { getAllTrainingsFor } from '$lib/util/getTrainings';

export const load = (async ({ params }) => {
	const id = parseInt(params.id);
	if (!id || isNaN(id)) {
		throw error(400, 'Invalid id');
	}

	const trainings = await getAllTrainingsFor(id);

	if (trainings.length) {
		return { trainings };
	}

	throw error(404, 'Not found');
}) satisfies PageServerLoad;
