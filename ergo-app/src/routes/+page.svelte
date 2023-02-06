<script lang="ts">
	import type { PageData } from './$types';

	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	export let data: PageData;
</script>

<div class="rounded container mx-auto my-4">
	<Table striped>
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Country</TableHeadCell>
			<!-- <TableHeadCell>TODO: Last updated</TableHeadCell> -->
		</TableHead>
		<TableBody>
			{#each data.rowers as rower}
				<TableBodyRow>
					<TableBodyCell>{rower.name}</TableBodyCell>
					<TableBodyCell>{rower.country}</TableBodyCell>
					<TableBodyCell>
						<a
							class="font-medium text-blue-600 hover:underline dark:text-blue-500"
							href="rower/{rower.id}">View</a
						>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
