<script context="module" lang="ts">
	export let title: string = 'Calibrate Controller Offsets';
	export let description: string =
		'Calibrates the positioning from your controller to the glove. Clicking the button will start a 10 second timer and will freeze your in-game hand. During the delay, move your hand to the position of the hand in-game. Once  the timer is up, you should see your virtual hand move with your real hand.';
</script>

<script lang="ts">
	import SuspenseButton from '$lib/components/form/input/button/SuspenseButton.svelte';
	import { writable } from 'svelte/store';
	import Select from '$lib/components/form/Select.svelte';
	import Number from '$lib/components/form/input/Number.svelte';

	const state = writable({
		calibrating: false,
		form: {
			left_hand: false,
			calibration_time: 5
		}
	});

	const begin_calibration = () => {};
</script>

<Select
	options={[
		{ title: 'Left Hand', value: true },
		{ title: 'Right Hand', value: false }
	]}
	bind:selected_value={$state.form.left_hand}
	label="For Hand"
/>
<div class="m-3">
	<Number label="Timer (Delay time)" bind:value={$state.form.calibration_time} />
	<SuspenseButton onClick={async () => beginCalibration()} disabled={$state.calibrating}>
		{#if $state.calibrating}
			{$state.timer}
		{:else}
			Start Auto-Calibration
		{/if}
	</SuspenseButton>
</div>
