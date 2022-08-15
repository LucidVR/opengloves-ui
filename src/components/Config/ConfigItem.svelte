<script>
  import TextInput from "../Input/Text.svelte";
  import CheckBox from "../Input/CheckBox.svelte";

  export let value;
  export let title;
</script>

{#if typeof value === "boolean"}
  <CheckBox bind:checked={value} label={title} />
{:else}
  <TextInput bind:value label={title} />
{/if}
