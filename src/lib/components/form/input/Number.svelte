<script lang="ts">
	import ToolTipContainer from './tooltip/ToolTipContainer.svelte';

	export let label: string;
	export let value: number;
	export let description: string;
</script>

<div class="flex flex-col flex-grow py-1">
	<div class="flex flex-row">
		<p class="block text-sm font-medium">
			{label}
		</p>
		{#if description}
			<ToolTipContainer {description} />
		{/if}
	</div>

	<div class="mt-1 flex rounded-md shadow-sm">
		<input
			type="number"
			name="text-input"
			bind:value
			class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block rounded text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-600 "
			placeholder={value}
		/>
	</div>
</div>
