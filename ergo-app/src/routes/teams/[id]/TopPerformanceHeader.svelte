<script lang="ts">
	import type { Database } from '$lib/database.types';
	import {
		Button,
		Checkbox,
		Chevron,
		Dropdown,
		DropdownDivider,
		DropdownItem
	} from 'flowbite-svelte';

	import { ArrowLeft, ArrowRight } from 'svelte-iconoir';

	let includeBikes = false;

	export let orderByKey: keyof Database['public']['Tables']['trainings']['Row'] = 'meters';
	export let ascending = false;

	let orders = ['Distances', 'Pace', 'Time', 'Date'];
	let orderName = 'Distances';

	/**
	 * Handle order change
	 * @param order Order to change to
	 */
	function handleOrder(order: string) {
		console.log({ order, orderName });
		orderName = order;
		ascending = false;

		switch (order) {
			case 'Distances':
				orderByKey = 'meters';
				break;
			case 'Pace':
				orderByKey = 'pace';
				ascending = true;
				break;
			case 'Time':
				orderByKey = 'duration';
				break;
			case 'Date':
				orderByKey = 'created_at';
				break;
		}
	}
</script>

<div class="container mx-auto p-8">
	<div class="flex justify-between">
		<h2 class="text-2xl">
			Top
			<Button color="light">
				<Chevron>
					{orderByKey}
				</Chevron>
			</Button>
			<Dropdown>
				{#each orders as order}
					<DropdownItem on:click={() => handleOrder(order)}>{order}</DropdownItem>
				{/each}
			</Dropdown>
			of the month
			<!-- TODO: order ascending yes/no -->
		</h2>
		<Button disabled><Chevron>Filter</Chevron></Button>
		<Dropdown>
			<DropdownItem>
				<Checkbox bind:checked={includeBikes}>Include bikes</Checkbox>
			</DropdownItem>
			<DropdownDivider />
			<DropdownItem>
				<div class="flex gap-2">
					<ArrowRight font-size="1rem" />
					Last month
				</div>
			</DropdownItem>
			<DropdownItem>
				<div class="flex gap-2">
					<ArrowLeft font-size="1rem" />
					Last month
				</div>
			</DropdownItem>
		</Dropdown>
	</div>

	<slot />
</div>
