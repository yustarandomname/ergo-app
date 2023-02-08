import type { Meta, StoryObj } from '@storybook/svelte';

import TopPerformance from './TopPerformance.svelte';

const meta = {
	title: 'Example/TopPerformance',
	component: TopPerformance,
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/7.0/svelte/configure/story-layout
		layout: 'fullscreen'
	}
} satisfies Meta<TopPerformance>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		teamId: 17833
	}
};

export const WithTeamId: Story = {
	args: {
		teamId: 123
	}
};
