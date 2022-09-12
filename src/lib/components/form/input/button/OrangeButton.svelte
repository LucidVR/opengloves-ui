<script>
	export let on_click = () => {};
</script>

<button
	type="button"
	class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-800 focus:outline-none "
	on:click={on_click}
>
	<slot />
</button>
