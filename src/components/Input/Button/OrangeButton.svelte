<script>
  export let text = '';

  export let onClick = () => {};

</script>

<button type="button"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        on:click={onClick}>
    {text}
</button>
