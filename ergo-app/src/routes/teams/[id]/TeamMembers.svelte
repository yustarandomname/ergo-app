<script lang="ts">
	import type { Database } from '$lib/database.types';
	import { supabase } from '$lib/util/supabase';
	import timePassed from '$lib/util/timePassed';
	import {
		Alert,
		Button,
		ListPlaceholder,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import MemberDrawer from './MemberDrawer.svelte';
	import TeamMembersHeader from './TeamMembersHeader.svelte';

	export let teamId: number;

	type Rower = Database['public']['Tables']['rowers']['Row'];

	let memberHidden = true;
	let memberSeleced: Rower | null = null;

	/**
	 * Get team members from supabase database
	 * @param teamId - team id
	 */
	function getTeam(teamId: number) {
		let query = supabase.from('rowers').select('*').eq('team_id', teamId).order('name');

		return query;
	}

	function handleMemberClick(member: Rower) {
		memberHidden = false;
		memberSeleced = member;
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
							<TableBodyCell>
								<Button on:click={() => handleMemberClick(member)}>View</Button>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				{/if}
			{/await}
		</TableBody>
	</Table>
</TeamMembersHeader>

{#if !memberHidden && memberSeleced}
	<MemberDrawer bind:memberHidden memberSelected={memberSeleced} />
{/if}
