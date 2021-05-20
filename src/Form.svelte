<script>
    import {extractItems, getConfiguration, saveConfiguration} from './utils/configurationHandler'
    import ToastStore from './stores/toast'

    import Select from './components/Select.svelte'
    import {writable} from 'svelte/store'
    import {onMount} from 'svelte'
    import ConfigItem from './components/Config/ConfigItem.svelte'
    import Accordion from "./components/Accordion/Accordion.svelte";
    import ConfigList from "./components/Config/ConfigList.svelte";

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
    let configurationItems = {};

    onMount(async () => {
        try {
            const result = getConfiguration();
            configurationItems = result;

            configurationOptions = extractItems(result);
            ToastStore.addToast(ToastStore.severity.SUCCESS, 'Successfully loaded configuration');
        } catch (e) {
            console.trace(e);
            ToastStore.addToast(ToastStore.severity.ERROR, 'Unable to load configuration, please open an issue on GitHub: ' + e.message);
        }


    });

    const onFormSubmit = () => {
        try {
            let specialOptions = [];
            Object.entries(configurationOptions).forEach(([key, value]) => {
                let options = {};
                if(value.multi) {
                    specialOptions.push({key, value: value.selectedOption.key});
                    options = value.options[value.selectedOption.key].options;
                    key = value.selectedOption.value;
                }
                else {
                    options = value.options;
                }

                Object.entries(options).forEach(([k, v]) => {
                    if(specialOptions.includes(k)) {
                        console.log("ye");
                    } else {
                        configurationItems[key][k] = v.value;
                    }
                });
            });

            specialOptions.forEach(v => {
                configurationItems.driver_openglove[v.key] = v.value;
            });
            saveConfiguration(configurationItems);
            ToastStore.addToast(ToastStore.severity.SUCCESS, 'Success saving configuration. Please restart SteamVR for the changes to take effect.');
        } catch (e) {
            console.trace(e);
            ToastStore.addToast(ToastStore.severity.ERROR, 'Unable to save configuration, please open an issue on GitHub: ' + e.message);
        }
    };

</script>
<div class="w-full flex flex-col justify-center items-center">
    <div class="mx-10 w-full overflow-auto">
        <h2 class="mb-5 text-center text-3xl font-extrabold text-gray-900">
            Configure your driver
        </h2>
        <div class="shadow rounded">
            <div class="px-4 py-5 space-y-6">
                {#each Object.entries(configurationOptions) as [key, value]}
                    <Accordion title={value.title}>
                        {#if value.multi}
                            <Select
                                    onSelectItemChanged={selectedKey => {
                                        configurationOptions[key].selectedOption = {
                                            key: selectedKey,
                                            value: configurationOptions[key].options[selectedKey].configKey,
                                        }
                                    }}
                                    options={Object.entries(value.options).map(([k, v]) => ({
                                        title: v.title,
                                        value: parseInt(k),
                                    }))}
                                    defaultValue={configurationOptions[key].selectedOption.key}
                            />
                            <ConfigList bind:configItems={configurationOptions[key].options[configurationOptions[key].selectedOption.key].options} />
                        {:else}
                            <ConfigList hiddenKeys={Object.keys(configurationOptions).map((k) => k)} configItems={configurationOptions[key].options} />
                        {/if}
                    </Accordion>
                {/each}
            </div>
            <div class="px-4 py-3 text-right">
                <button type="submit" on:click={onFormSubmit}
                        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Save
                </button>
            </div>
        </div>
    </div>

</div>
