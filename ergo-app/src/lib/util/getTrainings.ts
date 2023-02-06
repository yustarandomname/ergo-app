import { parse, type HTMLElement } from 'node-html-parser';
import { Axios } from 'axios';
import { SECRET_CONCEPT_COOKIE } from '$env/static/private';

const axios = new Axios({
	baseURL: 'https://log.concept2.com',
	timeout: 10000,
	headers: {
		Cookie: SECRET_CONCEPT_COOKIE
	}
});

import type { Database } from '../database.types';
import { supabase } from './supabase';

type Training = Database['public']['Tables']['trainings']['Row'];

export function parseNumber(value: string) {
	return parseInt(value.replace(/,/g, ''));
}

// TODO - move to utils
export function parseTime(duration: string) {
	const time = duration.split(':').map((n) => parseInt(n));

	switch (time.length) {
		case 3:
			return time[0] + ':' + time[1] + ':' + time[2];
		case 2:
			return '00:' + time[0] + ':' + time[1];
		case 1:
			return '00:00:' + time[0];
		default:
			return '00:00:00';
	}
}

export function parseWorkoutStat(workOutStat: HTMLElement, training: Partial<Training>) {
	const statName = workOutStat.querySelector('p, th')?.innerText;
	const statValue = workOutStat.querySelector('span, td')?.innerText;

	if (!statName || !statValue) return;

	switch (statName) {
		case 'Meters':
			training.meters = parseNumber(statValue);
			break;
		case 'Time':
			training.duration = parseTime(statValue);
			break;
		case 'Pace':
			training.pace = parseTime(statValue);
			break;
		case 'Heart Rate':
			training.heart_rate = parseNumber(statValue);
			break;
		case 'Rest Time':
			training.rest_duration = parseTime(statValue);
			break;
		case 'RPM':
			training.is_bike = true;
			training.stroke_rate = parseNumber(statValue);
			break;
		case 'Stroke Rate':
			training.stroke_rate = parseNumber(statValue);
			break;
		case 'Revolution Count':
			training.is_bike = true;
			training.stroke_count = parseNumber(statValue);
			break;
		case 'Stroke Count':
			training.stroke_count = parseNumber(statValue);
			break;
		case 'Drag Factor':
			training.drag_factor = parseNumber(statValue);
			break;
		case 'Calories':
			training.calories = parseNumber(statValue);
			break;
		default:
			console.log(`Unknown stat: ${statName} - ${statValue}`);
	}
}

export async function insertTrainingsIntoDB(training: Training) {
	const { error } = await supabase.from('trainings').upsert(training);
	if (error) throw error;
}

export async function getTraining(rowerId: number, trainingId: number) {
	const rowerTrainingPage = await axios.get(`/profile/${rowerId}/log/${trainingId}`);
	if (rowerTrainingPage.status != 200)
		throw Error(`You do not have permissions to see ${rowerId}'s training ${trainingId}`);

	const rowerTrainingPageDom = parse(rowerTrainingPage.data);
	const training: Partial<Training> = { rower_id: rowerId, id: trainingId };

	// Main stats - meters, time, pace, heart rate
	const workOutStats = rowerTrainingPageDom?.querySelectorAll('.workout__stat');
	workOutStats.forEach((stat) => parseWorkoutStat(stat, training));

	// More stats - rest time, stroke rate, stroke count, drag factor
	const workOutMoreStats = rowerTrainingPageDom?.querySelectorAll('.workout__more-stats > tr');
	workOutMoreStats.forEach((stat) => parseWorkoutStat(stat, training));

	const name = rowerTrainingPageDom?.querySelector('h2 > small')?.innerText;
	if (name) training.name = name;

	const description = rowerTrainingPageDom?.querySelector('.result-comments')?.innerText;
	if (description) training.description = description.replace(/^(\n*\s+)|\s+\n*$/g, '');

	const created_at = rowerTrainingPageDom?.querySelector('.workout__details > h4')?.innerText;

	if (created_at) {
		const created_at_date = new Date(created_at);
		if (created_at_date.valueOf()) training.created_at = created_at_date.toISOString();
	}

	return training;
}

async function selectTraining(trainingId: number): Promise<Training> {
	const { data, error } = await supabase
		.from('trainings')
		.select('*')
		.eq('id', trainingId)
		.single();

	if (error) throw error;

	return data;
}

async function parseLogTable(logTable: HTMLElement, rowerId: number): Promise<Training[]> {
	const trainings: Training[] = [];

	for (const row of logTable.querySelectorAll('tr')) {
		const trainingIdEl = row.querySelector('td > a')?.getAttribute('href');
		if (!trainingIdEl) {
			console.log('no training id', trainingIdEl);
			continue;
		}

		const trainingId = parseInt(trainingIdEl.split('/').pop() || '');

		if (!trainingId) continue;

		try {
			const training = await selectTraining(trainingId);
			trainings.push(training);
		} catch (e: any) {
			const finalTraining = (await getTraining(rowerId, trainingId)) as Training;

			trainings.push(finalTraining);
			await insertTrainingsIntoDB(finalTraining).catch((e: any) => console.log('insert error', e));
		}
	}

	return trainings;
}

export async function updateRowerUpdateTime(rowerId: number) {
	const { data, error } = await supabase
		.from('rowers')
		.update({ updated_at: new Date().toISOString() })
		.eq('id', rowerId);
	console.log({ data, error });
	return { data, error };
}

export async function getAllTrainingsFor(rowerId = 1789666): Promise<Training[]> {
	const rowerPage = await axios.get(`/profile/${rowerId}/log`);

	if (rowerPage.status != 200) throw Error(`You do not have permissions to see ${rowerId}`);
	const rowerPageDom = parse(rowerPage.data);

	const logTable = rowerPageDom?.querySelector('#log-table');
	if (!logTable) throw Error(`Could not find rower ${rowerId}`);

	const trainings = await parseLogTable(logTable, rowerId);

	updateRowerUpdateTime(rowerId);

	return trainings;
}
