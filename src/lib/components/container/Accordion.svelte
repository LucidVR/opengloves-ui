<script lang="ts">
	import { slide } from 'svelte/transition';

	export let title: string;
	export let expanded = false;
	export let out_animation = true;
</script>

<div
	class="bg-white dark:bg-gray-800 w-full rounded-lg px-6 border border-gray-300 dark:border-gray-800 hover:shadow-xl  cursor-pointer"
	on:mousedown={(e) => {
		e.stopPropagation();
		expanded = !expanded;
	}}
>
	<div class="flex flex-row justify-start py-3">
		<h3 class="font-medium text-sm">{title}</h3>
	</div>
	{#if expanded}
		<div on:mousedown={(e) => e.stopPropagation()}>
			<div
				in:slide={{ duration: 200 }}
				out:slide={{ duration: out_animation ? 200 : 0 }}
				on:click={(e) => e.stopPropagation()}
				class="mb-5 cursor-default"
			>
				<slot />
			</div>
		</div>
	{/if}
</div>

<style>
	div :global(.icon) {
		font-size: 5px;
	}
</style>
