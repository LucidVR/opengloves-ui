<script>
	import { Circle2 } from 'svelte-loading-spinners';
	export let suspense = false;
	export let message = '';
</script>

{#if !suspense}
	<slot />
{:else}
	<div class="flex flex-col justify-center items-center">
		<Circle2 />
		{#if message}
			<div class="mt-3">
				<p>{message}</p>
			</div>
		{/if}
	</div>
{/if}
