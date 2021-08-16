<script>
    export let label = '';
    export let value;

    let isNumber = typeof value === 'number';
</script>

<p class="block text-sm font-medium text-gray-700">
    {label}
</p>
<div class="mt-1 flex rounded-md shadow-sm">
    {#if isNumber}
        <input type="number" name="text-input" bind:value={value}
               class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded text-sm border-gray-300"
               placeholder="{value}">
        {:else}
        <input type="text" name="text-input" bind:value={value}
               class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded text-sm border-gray-300"
               placeholder="{value}">
        {/if}

</div>
