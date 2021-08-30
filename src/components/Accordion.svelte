<script>
    import {slide} from 'svelte/transition';

    export let title;

    let expanded = false;

</script>
<style>
    div :global(.icon) {
        font-size: 5px;
    }
</style>
<div class="bg-white w-full rounded-lg px-6 border border-gray-300 hover:shadow-xl  cursor-pointer"
     on:click={() => expanded = !expanded}>
    <div class="flex flex-row justify-start py-3">
        <h3 class="font-medium text-gray-800 text-sm">{title}</h3>
    </div>
    {#if expanded}
        <div transition:slide on:click={e => e.stopPropagation()} class="mb-5 cursor-default">
            <slot/>
        </div>
    {/if}
</div>
