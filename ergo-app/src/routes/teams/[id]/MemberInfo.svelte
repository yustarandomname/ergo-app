<script lang="ts">
	import { supabase } from '$lib/util/supabase';
	import timePassed from '$lib/util/timePassed';
	import {
		Alert,
		ListPlaceholder,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	export let rowerId: number;

	function getTrainings(rowerId: number) {
		let query = supabase.from('trainings').select('*').eq('rower_id', rowerId);
		return query;
	}
</script>

<!-- TODO: main stats -->

<Table class="mt-4">
	<TableHead>
		<TableHeadCell>Name</TableHeadCell>
		<TableHeadCell>Meters</TableHeadCell>
		<TableHeadCell>Pace</TableHeadCell>
		<TableHeadCell>Date</TableHeadCell>
	</TableHead>
	<TableBody>
		{#await getTrainings(rowerId)}
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
						<TableBodyCell
							>{training.name}
							{#if training.description}
								<p class="text-sm text-gray-500">({training.description})</p>
							{/if}
						</TableBodyCell>
						<TableBodyCell>{training.meters}</TableBodyCell>
						<TableBodyCell>{training.pace}</TableBodyCell>
						<TableBodyCell>{timePassed(training.created_at)}</TableBodyCell>
					</TableBodyRow>
				{/each}
			{/if}
		{/await}
	</TableBody>
</Table>
