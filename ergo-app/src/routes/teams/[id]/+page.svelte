<script lang="ts">
	import type { PageData } from './$types';
	import TeamMembers from './TeamMembers.svelte';
	import TopPerformance from './TopPerformance.svelte';

	export let data: PageData;
</script>

<TopPerformance teamId={data.teamId} />

<TeamMembers teamId={data.teamId} />
