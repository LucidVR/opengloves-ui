<script lang="ts">
	import ToolTipContainer from './tooltip/ToolTipContainer.svelte';

	export let label: string;
	export let description: string;
	export let checked = false;
</script>

<div class="flex flex-row">
	<label class="flex items-center space-x-3 my-2">
		<input
			type="checkbox"
			bind:checked
			name="checkbox"
			class="form-tick appearance-none h-5 w-5 dark:bg-gray-600 dark:border-gray-600 border border-gray-300 rounded-md checked:bg-blue-600 dark:checked:bg-blue-800 checked:border-transparent focus:outline-none cursor-pointer"
		/>
		<span class="font-medium text-sm">{label}</span>
	</label>
	{#if description}
		<div class="py-2">
			<ToolTipContainer {description} />
		</div>
	{/if}
</div>
