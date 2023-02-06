<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	function formatDate(str: string | null) {
		if (!str) return '';

		const date = new Date(str);

		return new Intl.DateTimeFormat('en').format(date);
	}
</script>

<div class="rounded container mx-auto my-4">
	<Table striped>
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Date</TableHeadCell>
			<TableHeadCell>Duration</TableHeadCell>
			<TableHeadCell>Pace</TableHeadCell>
			<!-- <TableHeadCell>TODO: Last updated</TableHeadCell> -->
		</TableHead>
		<TableBody>
			{#each data.trainings as training}
				<TableBodyRow>
					<TableBodyCell
						>{training.name}<br /><small>{training.description || ''}</small></TableBodyCell
					>
					<TableBodyCell>{formatDate(training.created_at)}</TableBodyCell>
					<TableBodyCell>{training.duration}</TableBodyCell>
					<TableBodyCell>{training.pace}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
