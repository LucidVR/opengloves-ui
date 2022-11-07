<script lang="ts">
	export let on_click = async () => {};
	export let disabled = false;
	let loading = false;
</script>

<button
	on:click={async () => {
		if (loading) return;
		loading = true;
		await on_click();
		loading = false;
	}}
	class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 dark:bg-indigo-800 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
	disabled={loading || disabled}
>
	{#if !loading}
		<slot />
	{:else}
		<svg
			class="animate-spin h-5 w-5 text-white"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
	{/if}
</button>
