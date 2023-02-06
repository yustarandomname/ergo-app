<script lang="ts">
	import type { Database } from '$lib/database.types';
	import timePassed from '$lib/util/timePassed';
	import { Alert, Button, CloseButton, Drawer, Spinner } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import MemberInfo from './MemberInfo.svelte';

	export let memberSelected: Database['public']['Tables']['rowers']['Row'] | null;
	export let memberHidden = true;

	let isUpdating = false;

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	/**
	 * Fetches the latest data from the concept2 website and updates the rower's data
	 */
	async function updateRowerData() {
		if (!memberSelected) return;

		isUpdating = true;

		const res = await fetch(`/api/trainings?rower_id=${memberSelected.id}`, {
			method: 'GET'
		});

		if (res.ok) {
			memberSelected.updated_at = new Date().toISOString();
			isUpdating = false;
		}
	}

	function closeDrawer() {
		memberHidden = true;
		memberSelected = null;
		isUpdating = false;
	}
</script>

<Drawer
	width="w-full  md:max-w-xl"
	transitionType="fly"
	{transitionParams}
	bind:hidden={memberHidden}
	id="sidebar1"
>
	{#if memberSelected}
		<div class="flex items-center">
			<h5
				id="drawer-label"
				class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
			>
				{memberSelected.name}
			</h5>
			<CloseButton on:click={closeDrawer} class="mb-4 dark:text-white" />
		</div>

		{#key memberSelected.updated_at}
			<MemberInfo rowerId={memberSelected.id} />

			<div class="flex gap-4 items-center justify-end py-4">
				<span>Last updated {timePassed(memberSelected.updated_at)}</span>
				<Button on:click={updateRowerData} disabled={isUpdating}>
					{#if isUpdating}<Spinner class="mr-3" size="4" color="white" />{/if}
					Update
				</Button>
			</div>
		{/key}

		<Alert color="yellow">
			<span class="font-medium">Warning:</span> Updating will fetch data from the concept2 website, which
			might be slow (≈ 10 to 30 seconds). It will run in the background and you can continue using the
			app.
		</Alert>
	{/if}
</Drawer>
