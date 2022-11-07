<script lang="ts">
	import Text from '$lib/components/form/input/Text.svelte';
	import Number from '$lib/components/form/input/Number.svelte';
	import CheckBox from '../form/input/CheckBox.svelte';

	export let label: string;
	export let value: string | number | boolean;
	export let description: string;
</script>

{#if typeof value === 'string'}
	<Text bind:value {label} {description} />
{/if}

{#if typeof value === 'boolean'}
	<CheckBox bind:checked={value} {label} {description} />
{/if}

{#if typeof value === 'number'}
	<Number bind:value {label} {description} />
{/if}
