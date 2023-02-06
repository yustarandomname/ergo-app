<script lang="ts">
	import TopPerformance from './TopPerformance.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<TopPerformance />

{JSON.stringify(data)}
