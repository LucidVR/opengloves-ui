<script lang="ts" context="module">
	export let title = 'Servo Calibration';
	export let description =
		'Move servos to test force feedback functionality. Retracting servos fully means they should not apply any force on your fingers throughout curling your finger, while extending them fully means you should not be able to curl your fingers at all.';
</script>

<script lang="ts">
	import { writable } from 'svelte/store';
	import Select from '$lib/components/form/Select.svelte';
	import { make_http_request } from '../scripts/http';
	import { Severity, ToastStore } from '../stores/toast';

	const state = writable({
		loading: false,
		form: {
			left_hand: true,
			amount: 0
		}
	});

	const move_servos = async () => {
		try {
			console.log($state.form.left_hand);
			$state.loading = true;
			const path = '/functions/force_feedback/'.concat($state.form.left_hand ? 'left' : 'right');
			await make_http_request({
				path,
				method: 'POST',
				body: {
					thumb: $state.form.amount,
					index: $state.form.amount,
					middle: $state.form.amount,
					ring: $state.form.amount,
					pinky: $state.form.amount
				}
			});

			ToastStore.add_toast(Severity.SUCCESS, 'Successfully updated servos');
		} catch (e) {
			console.trace(e);

			ToastStore.add_toast(Severity.ERROR, e);
		} finally {
			$state.loading = false;
		}
	};
</script>

<Select
	options={[
		{ title: 'Left Hand', value: true },
		{ title: 'Right Hand', value: false }
	]}
	bind:selected_value={$state.form.left_hand}
	label="For Hand"
/>
<div class="mt-3 flex flex-col">
	<label for="servo-distance">Amount: {$state.form.amount}</label>
	<input
		type="range"
		min="0"
		max="1000"
		bind:value={$state.form.amount}
		class="range range-xs"
		id="servo-distance"
		on:mouseup={() => {
			move_servos();
		}}
	/>
</div>
<div class="mt-3">
	<p class="mb-2">or:</p>
	<button
		class="btn btn-sm btn-info"
		on:click={() => {
			$state.form.amount = 0;
			move_servos();
		}}
		>Retract Servos Fully
	</button>
	<button
		class="btn btn-sm btn-success"
		on:click={() => {
			$state.form.amount = 1000;
			move_servos();
		}}
		>Extend Servos Fully
	</button>
</div>
