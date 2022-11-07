<script lang="ts">
	import { ToastStore, Severity } from '$lib/stores/toast';

	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Suspense from '$lib/components/async/Suspense.svelte';
	import { make_http_request } from '$lib/scripts/http.ts';
	import OrangeButton from '$lib/components/form/input/button/OrangeButton.svelte';
	import { pretty_print_section } from '../../../lib/scripts/string';
	import Accordion from '$lib/components/container/Accordion.svelte';
	import ConfigItem from '$lib/components/config/ConfigItem.svelte';
	import { get_description_for_key, pretty_print_key } from '$lib/scripts/string.js';
	import SuspenseButton from '$lib/components/form/input/button/SuspenseButton.svelte';
	import { writeText } from '@tauri-apps/api/clipboard';

	const state = writable({
		status: 'loading' as 'idle' | 'loading' | 'error',
		error_message: '',
		configuration: null as null | object
	});

	const load = async () => {
		$state.status = 'loading';
		try {
			const response = (await make_http_request({ path: '/settings', method: 'GET' })) as string;
			$state.configuration = JSON.parse(response);

			$state.status = 'idle';
		} catch (e) {
			$state.status = 'error';
			console.log(e);

			if (e.includes('os error 10061')) {
				ToastStore.add_toast(
					Severity.ERROR,
					'Failed to connect to server! Make sure SteamVR is running, with a HMD and OpenGloves enabled.'
				);
			}
		}
	};

	const copy_configuration_to_clipboard = async () => {
		try {
			//pretty print json string
			await writeText(JSON.stringify($state.configuration, null, 2));

			ToastStore.add_toast(Severity.SUCCESS, 'Successfully copied to clipboard.');
		} catch (e) {
			console.trace(e);

			ToastStore.add_toast(Severity.ERROR, 'Could not copy configuration to clipboard. ' + e);
		}
	};

	const save_configuration = async () => {
		try {
			await make_http_request({ path: '/settings', method: 'POST', body: $state.configuration });

			ToastStore.add_toast(
				Severity.SUCCESS,
				'Successfully saved configuration. Please restart SteamVR for the changes to take effect.'
			);
		} catch (e) {
			ToastStore.add_toast(Severity.ERROR, e);
		}
	};

	onMount(async () => {
		await load();
	});
</script>

<div class="h-full w-full flex items-center justify-center flex-col mb-10">
	<Suspense suspense={$state.status === 'loading'} message="Loading...">
		{#if $state.status === 'error'}
			<button class="btn btn-warning" on:click={load}>Retry Load</button>
		{:else}
			<h2 class="mb-5 text-center text-3xl font-extrabold mt-3">Driver Configuration</h2>
			<div class="w-3/4 space-y-6 overflow-auto max-w-md">
				{#each Object.keys($state.configuration) as section_key, i}
					<Accordion title={pretty_print_section(section_key)}>
						{#each Object.keys($state.configuration[section_key]) as config_key}
							<ConfigItem
								label={pretty_print_key(section_key, config_key)}
								description={get_description_for_key(section_key, config_key)}
								bind:value={$state.configuration[section_key][config_key]}
							/>
						{/each}
					</Accordion>
				{/each}
				<div class="flex flex-row w-full">
					<OrangeButton on_click={copy_configuration_to_clipboard}
						>Copy Config to Clipboard
					</OrangeButton>
					<div class="flex-grow" />
					<SuspenseButton on_click={save_configuration}>Save</SuspenseButton>
				</div>
			</div>
		{/if}
	</Suspense>
</div>
