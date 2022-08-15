<script>
  import TextInput from "../Input/Text.svelte";
  import CheckBox from "../Input/CheckBox.svelte";

  export let value;
  export let label;
  export let description;
</script>

{#if typeof value === "boolean"}
  <CheckBox bind:checked={value} label={label} description={description} />
{:else}
  <TextInput bind:value label={label} description={description} />
{/if}
