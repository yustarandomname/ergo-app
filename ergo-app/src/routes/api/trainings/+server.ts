import type { RequestHandler } from './$types';
import { getAllTrainingsFor } from '$lib/util/getTrainings';

export const GET = (async ({ url }) => {
	const rowerId = parseInt(url.searchParams.get('rower_id') ?? '0');

	const trainings = await getAllTrainingsFor(rowerId);
	const trainingsJson = JSON.stringify(trainings, null, 2);

	return new Response(String(trainingsJson));
}) satisfies RequestHandler;
