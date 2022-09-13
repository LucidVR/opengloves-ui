<script lang="ts">
	import ToolTipContainer from './tooltip/ToolTipContainer.svelte';

	export let label: string;
	export let description: string;
	export let checked = false;
</script>

<div class="flex flex-row">
	<label class="flex items-center space-x-3 my-2">
		<input type="checkbox" bind:checked name="checkbox" class="checkbox" />
		<span class="font-medium text-sm">{label}</span>
	</label>
	{#if description}
		<div class="py-2">
			<ToolTipContainer {description} />
		</div>
	{/if}
</div>
