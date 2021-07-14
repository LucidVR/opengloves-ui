<script>
    import ConfigItem from "./ConfigItem.svelte";

    export let configItems;
    export let onValueChange = () => {};
    export let hiddenKeys = [];
</script>

{#each Object.keys(configItems) as k}
    {#if !hiddenKeys.includes(k)}
        <ConfigItem title={k} bind:value={configItems[k]} key={k} />
    {/if}
{/each}
