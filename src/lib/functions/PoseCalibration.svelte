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
	import { make_http_request } from '../scripts/http';
	import { Severity, ToastStore } from '../stores/toast';

	const state = writable({
		calibrating: false,
		timer: 0,
		loading: false,
		form: {
			left_hand: false,
			calibration_time: 5
		}
	});

	const begin_calibration = async () => {
		$state.calibrating = true;
		$state.timer = $state.form.calibration_time;

		try {
			const path = '/functions/pose_calibration/'.concat($state.form.left_hand ? 'left' : 'right');

			await make_http_request({
				path,
				method: 'POST',
				body: {
					start: true
				}
			});

			const interval = setInterval(() => {
				if ($state.timer <= 0) {
					clearInterval(interval);

					make_http_request({
						path,
						method: 'POST',
						body: {
							start: false
						}
					}).then(() => {
						ToastStore.add_toast(Severity.SUCCESS, 'Successfully updated pose calibration');

						$state.calibrating = false;
						$state.loading = false;
					});
				} else $state.timer = $state.timer - 1;
			}, 1000);
		} catch (e) {
			console.trace(e);

			$state.calibrating = false;
			$state.loading = false;

			if (e.includes('os error 10061')) {
				ToastStore.add_toast(
					Severity.ERROR,
					'No service exists to service this request. Are you sure the driver and hand you have selected are enabled?'
				);
			} else ToastStore.add_toast(Severity.ERROR, e);
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
<Number label="Timer (Delay time)" bind:value={$state.form.calibration_time} />
<SuspenseButton on_click={async () => begin_calibration()} disabled={$state.calibrating}>
	{#if $state.calibrating}
		<span class="countdown">
			<span style="--value:{$state.timer};" />
		</span>
	{:else}
		Start Auto-Calibration
	{/if}
</SuspenseButton>
