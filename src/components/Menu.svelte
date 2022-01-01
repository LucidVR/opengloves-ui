<script>
    export let items = [];
    export let active = 0;
</script>

<nav class="bg-gray-800 w-full">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-16">
            <div class="flex-1 flex items-center justify-center">
                <div class="flex space-x-4">
                    {#each items as item, i}
                        {#if i === active}
                            <a
                                    on:click={item.onClick}
                                    class="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                                    aria-current="page">{item.title}</a>
                        {:else}
                            <a
                                    on:click={item.onClick}
                                    class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                                    on:click={() => active = i}>{item.title}</a>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
    </div>
</nav>