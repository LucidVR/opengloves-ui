<script>
    import TextInput from '../TextInput.svelte'
    import Select from "../Select.svelte";

    export let key;
    export let value;
    export let title;

    export let onChange = () => {}
</script>

{#if typeof value === 'boolean'}
    <Select onSelectItemChanged={n => value = n} label={title} defaultValue={value}
            options={[{title: 'True', value: true}, {title: 'False', value: false}]}/>
{:else}
    <TextInput bind:value={value} label={title} />
{/if}
