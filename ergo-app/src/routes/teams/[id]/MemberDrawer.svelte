<script lang="ts">
	import type { Database } from '$lib/database.types';
	import timePassed from '$lib/util/timePassed';
	import { Alert, Button, CloseButton, Drawer } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import MemberInfo from './MemberInfo.svelte';

	export let memberSelected: Database['public']['Tables']['rowers']['Row'];
	export let memberHidden = true;

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};
</script>

<Drawer
	width="w-full  md:max-w-xl"
	transitionType="fly"
	{transitionParams}
	bind:hidden={memberHidden}
	id="sidebar1"
>
	<div class="flex items-center">
		<h5
			id="drawer-label"
			class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
		>
			{memberSelected.name}
		</h5>
		<CloseButton on:click={() => (memberHidden = true)} class="mb-4 dark:text-white" />
	</div>

	<MemberInfo rowerId={memberSelected.id} />

	<div class="flex gap-4 items-center justify-end py-4">
		<span>Last updated {timePassed(memberSelected.updated_at)}</span>
		<Button>Update</Button>
	</div>

	<Alert color="yellow">
		<span class="font-medium">Warning:</span> Updating will fetch data from the concept2 website, which
		might be slow (≈ 30 seconds). It will run in the background and you can continue using the app.
	</Alert>
</Drawer>
