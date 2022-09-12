<script lang="ts">
	export let items: { href: string; title: string }[] = [];
	export let index_active = 0;
</script>

<nav class="flex bg-gray-800 w-full justify-center">
	<div class="flex items-center justify-between h-16">
		<div class="flex-1 flex items-center justify-center">
			<div class="flex space-x-4">
				{#each items as item, i}
					{#if i === index_active}
						<a
							class="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
							aria-current="page">{item.title}</a
						>
					{:else}
						<a
							class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
							href={item.href}
							on:click={() => {
								index_active = i;
							}}>{item.title}</a
						>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</nav>
