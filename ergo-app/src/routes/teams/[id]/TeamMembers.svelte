<script lang="ts">
	import type { Database } from '$lib/database.types';
	import { supabase } from '$lib/util/supabase';
	import timePassed from '$lib/util/timePassed';
	import type { PostgrestError } from '@supabase/supabase-js';
	import {
		Alert,
		Button,
		ButtonGroup,
		ListPlaceholder,
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import MemberDrawer from './MemberDrawer.svelte';

	export let teamId: number;

	type Rower = Database['public']['Tables']['rowers']['Row'] & { isLoading: boolean };

	let memberHidden = true;
	let memberSeleced: Rower | null = null;
	let last_updated: string | null = null;

	let loadingMembers = true;
	let members: Rower[] = [];
	let memberError: PostgrestError | null = null;

	/**
	 * Get team members from supabase database
	 * @param teamId - team id
	 */
	async function getTeam(teamId: number) {
		let { data, error } = await supabase
			.from('rowers')
			.select('*')
			.eq('team_id', teamId)
			.order('name');

		memberError = error;

		members = (data as Rower[]) || [];
		members.map((m) => (m.isLoading = false));
	}

	function handleMemberClick(member: Rower) {
		if (member.isLoading) return;

		memberHidden = false;
		memberSeleced = member;
	}

	function supscribeToUpdates() {
		supabase
			.channel('custom-update-channel')
			.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rowers' }, (payload) => {
				// Update last updated date for the member that is updated
				members.forEach((member) => {
					if (member.id === payload.new.id) {
						member.updated_at = new Date().toISOString();
					}
				});

				last_updated = new Date().toISOString();
			})
			.subscribe();
	}

	async function reloadAll() {
		members = members.map((m) => {
			m.isLoading = true;
			return m;
		});

		const membersReload = members.map(async (m) => {
			const newMemberRes = await fetch(`/api/trainings?rower_id=${m.id}`);

			if (newMemberRes.status !== 200) {
				m.isLoading = false;
				return m;
			}

			m.isLoading = false;
			last_updated = new Date().toISOString();
			return m;
		});

		await Promise.all(membersReload);
		last_updated = new Date().toISOString();
	}

	onMount(async () => {
		await getTeam(teamId);
		supscribeToUpdates();

		loadingMembers = false;
	});
</script>

<div class="container max-w-5xl mx-auto p-8">
	<div class="flex justify-between pb-4 gap-2">
		<h2 class="text-2xl">Rowers in team</h2>

		<ButtonGroup>
			<Button on:click={reloadAll} color="blue">Reload all</Button>
			<!-- TODO: add functionality -->
			<Button disabled>Export</Button>
		</ButtonGroup>
	</div>

	<Table hoverable striped class="mt-4">
		<TableHead>
			<TableHeadCell />
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Country</TableHeadCell>
			<TableHeadCell>Last updated</TableHeadCell>
		</TableHead>
		<TableBody>
			{#if loadingMembers}
				<TableBodyRow>
					<td colspan="4">
						<ListPlaceholder class="!max-w-full" />
					</td>
				</TableBodyRow>
			{:else if memberError}
				<TableBodyRow>
					<td colspan="4">
						<Alert color="red">
							<span class="font-medium">Error!</span>
							{memberError.message}
						</Alert>
					</td>
				</TableBodyRow>
			{:else}
				{#key last_updated}
					{#each members as member}
						<TableBodyRow class="cursor-pointer" on:click={() => handleMemberClick(member)}>
							<TableBodyCell>
								{#if member.isLoading}
									<Spinner />
								{/if}
							</TableBodyCell>

							<TableBodyCell>{member.name}</TableBodyCell>
							<TableBodyCell>{member.country}</TableBodyCell>
							<TableBodyCell>{timePassed(member.updated_at)}</TableBodyCell>
							<TableBodyCell>
								<Button>View</Button>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				{/key}
			{/if}
		</TableBody>
	</Table>
</div>

{#if !memberHidden && memberSeleced}
	<MemberDrawer bind:memberHidden memberSelected={memberSeleced} />
{/if}
