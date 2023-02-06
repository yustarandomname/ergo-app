<script lang="ts">
	import { Button, ButtonGroup } from 'flowbite-svelte';
</script>

<div class="container max-w-5xl mx-auto p-8">
	<div class="flex justify-between gap-2 flex-col md:flex-row">
		<h2 class="text-2xl">Rowers in team</h2>

		<ButtonGroup>
			<!-- TODO: add functionality -->
			<Button disabled color="blue">Reload all</Button>
			<Button disabled>Export</Button>
		</ButtonGroup>
	</div>

	<slot />
</div>
