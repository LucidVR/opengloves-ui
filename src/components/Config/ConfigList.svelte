<script>
    import ConfigItem from "./ConfigItem.svelte";

    export let configItems = {};
    export let hiddenKeys = [];
    export let onValueChange = () => {};
</script>

{#each Object.entries(configItems) as [k, v]}
    {#if !hiddenKeys.includes(k)}
        <ConfigItem title={v.title} bind:value={v.value} key={k} onChange={v => onValueChange(k, v)}/>
    {/if}
{/each}
