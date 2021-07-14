<script>
    import {createConfiguration, parseConfiguration, getConfiguration, saveConfiguration} from './utils/configuration'
    import ToastStore from './stores/toast'

    import Select from './components/Select.svelte'
    import {writable} from 'svelte/store'
    import {onMount} from 'svelte'
    import Accordion from './components/Accordion/Accordion.svelte'
    import ConfigList from './components/Config/ConfigList.svelte'
    import OrangeButton from './components/Button/OrangeButton.svelte'

    import {writeText} from '@tauri-apps/api/clipboard';
    import SuspenseButton from "./components/Button/SuspenseButton.svelte";
    import Suspense from "./components/Suspense.svelte";

    const formData = writable({
        driver_config: {
            left_enabled: true,
            right_enabled: true,
            communication_protocol: 0,
            device_driver: 0,
            encoding_protocol: 0,
        },
    });
	
    let configurationOptions = [];
    let loaded = false;
    onMount(async () => {
        try {
            const result = await getConfiguration();
            configurationOptions = parseConfiguration(result);
            ToastStore.addToast(ToastStore.severity.SUCCESS, 'Successfully loaded configuration');
            loaded = true;
        } catch (e) {
            console.trace(e)
            ToastStore.addToast(ToastStore.severity.ERROR, 'Unable to load configuration, please open an issue on GitHub: ' + e);
        }
    });


    const onFormSubmit = async () => {
        try {
            const result = createConfiguration(configurationOptions);
            await saveConfiguration(result);
            ToastStore.addToast(ToastStore.severity.SUCCESS, 'Success saving configuration. Please restart SteamVR for the changes to take effect.');
        } catch (e) {
            console.trace(e);
            ToastStore.addToast(ToastStore.severity.ERROR, 'Unable to save configuration, please open an issue on GitHub: ' + e);
        }
    }

    const copyConfigurationToClipboard = () => {
        try {
            const result = createConfiguration(configurationOptions);

            writeText(JSON.stringify(result));

            ToastStore.addToast(ToastStore.severity.SUCCESS, 'Successfully copied to clipboard.');
        } catch (e) {
            console.trace(e);

            ToastStore.addToast(ToastStore.severity.ERROR, 'Could not copy configuration to clipboard.');
        }
    }
</script>
<div class="w-full flex flex-col justify-center items-center">
    <div class="mx-10 w-full overflow-auto">
        <h2 class="mb-5 text-center text-3xl font-extrabold text-gray-900">
            Configure your driver
        </h2>
            <div class="shadow rounded">
                <div class="px-4 py-5 space-y-6">
                    <Suspense suspense={!loaded}>
                    {#each Object.entries(configurationOptions) as [key, value]}
                        <Accordion title={value.title}>
                            {#if Array.isArray(value.options)}
                                <Select
                                        onSelectItemChanged={selectedKey => {
                                        configurationOptions.driver_openglove.options[key] = selectedKey;
                                    }}
                                        options={Object.entries(value.options).map(([k, v]) => ({
                                        title: v.title,
                                        value: parseInt(k),
                                    }))}
                                        defaultValue={configurationOptions.driver_openglove.options[key]}
                                />
                                <ConfigList
                                        bind:configItems={value.options[configurationOptions.driver_openglove.options[key]].options} />
                            {:else}
                                <ConfigList
                                        hiddenKeys={Object.keys(configurationOptions).map((k) => k)}
                                        bind:configItems={configurationOptions[key].options}
                                />
                            {/if}
                        </Accordion>
                    {/each}
                    </Suspense>

                </div>
                <div class="flex flex-row px-4">
                    <OrangeButton text="Copy Config to Clipboard" onClick={copyConfigurationToClipboard} />
                    <div class="flex-grow"></div>
                    <SuspenseButton onClick={onFormSubmit}>Save</SuspenseButton>
                </div>
            </div>
    </div>

</div>
