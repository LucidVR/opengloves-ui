<script>
    import {Circle2} from 'svelte-loading-spinners';
    export let suspense = false;
</script>

{#if !suspense}
   <slot />
{:else}
    <div class="flex flex-row justify-center">
        <Circle2 />
    </div>
{/if}