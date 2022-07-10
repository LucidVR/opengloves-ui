<script>
  export let onClick = () => {};
</script>

<button
  type="button"
  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
  on:click={onClick}
>
  <slot />
</button>
