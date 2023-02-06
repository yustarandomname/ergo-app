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
	import TeamMembersHeader from './TeamMembersHeader.svelte';

	export let teamId: number;

	/**
	 * Get team members from supabase database
	 * @param teamId - team id
	 */
	function getTeam(teamId: number) {
		let query = supabase.from('rowers').select('*').eq('team_id', teamId).order('name');

		return query;
	}
</script>

<TeamMembersHeader>
	<Table hoverable striped class="mt-4">
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Country</TableHeadCell>
			<TableHeadCell>Last updated</TableHeadCell>
		</TableHead>
		<TableBody>
			{#await getTeam(teamId)}
				<TableBodyRow>
					<td colspan="4">
						<ListPlaceholder class="max-w-full" />
					</td>
				</TableBodyRow>
			{:then { data: members, error }}
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
					{#each members as member}
						<TableBodyRow class="cursor-pointer">
							<TableBodyCell>{member.name}</TableBodyCell>
							<TableBodyCell>{member.country}</TableBodyCell>
							<TableBodyCell>{timePassed(member.updated_at)}</TableBodyCell>
							<TableBodyCell class="text-blue-500">View</TableBodyCell>
						</TableBodyRow>
					{/each}
				{/if}
			{/await}
		</TableBody>
	</Table>
</TeamMembersHeader>
