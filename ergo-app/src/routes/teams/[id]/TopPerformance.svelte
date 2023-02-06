<script lang="ts">
	import type { Database } from '$lib/database.types';
	import { supabase } from '$lib/util/supabase';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		ListPlaceholder,
		Alert
	} from 'flowbite-svelte';

	import TopPerformanceHeader from './TopPerformanceHeader.svelte';

	export let teamId: number;

	let orderByKey: keyof Database['public']['Tables']['trainings']['Row'] = 'meters';
	let orderAscending = false;

	async function top5Performances() {
		// Begin of this month
		const start = new Date();
		start.setDate(1);
		start.setHours(0, 0, 0, 0);

		console.log({ teamId });

		let query = supabase
			.from('trainings')
			.select('*, rower_id!inner(name, team_id)')
			.gte('created_at', start.toISOString());

		query = query.eq('rower_id.team_id', teamId);
		query = query.order(orderByKey, { ascending: orderAscending });

		return query.limit(5);
	}

	function getRowerName(rowerId: any): string {
		if (!rowerId) return 'unknown';
		if (Array.isArray(rowerId)) {
			return rowerId.map((rower) => rower.name).join(', ');
		}
		return (rowerId.name as string) || 'unknown';
	}
</script>

<TopPerformanceHeader bind:orderByKey bind:ascending={orderAscending}>
	<Table class="mt-4">
		<TableHead>
			<TableHeadCell>Rower</TableHeadCell>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Meters</TableHeadCell>
			<TableHeadCell>Pace</TableHeadCell>
			<TableHeadCell>Date</TableHeadCell>
		</TableHead>
		<TableBody>
			{#key orderByKey}
				{#await top5Performances()}
					<TableBodyRow>
						<td colspan="4">
							<ListPlaceholder class="max-w-full" />
						</td>
					</TableBodyRow>
				{:then { data: trainings, error }}
					{#if error}
						<TableBodyRow>
							<td colspan="4">
								<Alert color="red">
									<span class="font-medium">Error!</span>
									{error.message}
								</Alert>
							</td>
						</TableBodyRow>
					{:else}
						{#each trainings as training}
							<TableBodyRow>
								<TableBodyCell>{getRowerName(training.rower_id)}</TableBodyCell>
								<TableBodyCell>{training.name}</TableBodyCell>
								<TableBodyCell>{training.meters}</TableBodyCell>
								<TableBodyCell>{training.pace}</TableBodyCell>
								<TableBodyCell>{new Date(training.created_at || '').toDateString()}</TableBodyCell>
							</TableBodyRow>
						{/each}
					{/if}
				{/await}
			{/key}
		</TableBody>
	</Table>
</TopPerformanceHeader>
