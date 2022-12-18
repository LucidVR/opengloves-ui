<script>
	import Navbar from '$lib/components/nav/Navbar.svelte';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';

	const state = writable({
		current_page: 0
	});
</script>

<div
	class="font-sans h-screen w-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-300 text-gray-800 overflow-x-hidden"
>
	<div class="flex flex-col h-full w-full">
		<Navbar
			items={[
				{
					title: 'Configuration',
					href: '/configuration'
				},
				{
					title: 'Functions',
					href: '/functions'
				}
			]}
			bind:index_active={$state.current_page}
		/>
		<div class="flex-grow">
			<slot />
		</div>
	</div>
</div>
