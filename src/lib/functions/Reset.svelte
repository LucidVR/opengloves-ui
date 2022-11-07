<script context="module" lang="ts">
	export let title: string = 'Reset Configuration to Default';
	export let description: string =
		"If you've somehow messed up your configuration, you can reset it here.";
</script>

<script lang="ts">
	import SuspenseButton from '$lib/components/form/input/button/SuspenseButton.svelte';
	import { make_http_request } from '../scripts/http';
	import { Severity, ToastStore } from '../stores/toast';

	const reset_configuration = async () => {
		try {
			await make_http_request({ path: '/settings', method: 'DELETE' });

			ToastStore.add_toast(Severity.SUCCESS, 'Successfully reset configuration to default.');
		} catch (e) {
			ToastStore.add_toast(Severity.ERROR, e);
		}
	};
</script>

<div class="my-3">
	<SuspenseButton on_click={reset_configuration} colour="red">Reset Configuration</SuspenseButton>
</div>
