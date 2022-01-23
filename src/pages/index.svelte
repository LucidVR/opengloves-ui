<script>
    import {
        createConfiguration,
        getConfiguration,
        primaryConfigurationSection,
        saveConfiguration,
    } from '../utils/configuration'
    import ToastStore from '../stores/toast'
    import SplashStore from '../stores/splash';

    import Select from '../components/Input/Select.svelte'
    import {writable} from 'svelte/store'
    import {onDestroy, onMount} from 'svelte'
    import Accordion from '../components/Accordion.svelte'
    import ConfigList from '../components/Config/ConfigList.svelte'
    import OrangeButton from '../components/Input/Button/OrangeButton.svelte'

    import {writeText} from '@tauri-apps/api/clipboard';
    import SuspenseButton from "../components/Input/Button/SuspenseButton.svelte";
    import Suspense from "../components/Suspense.svelte";
    import Init from "../splashscreens/Init.svelte";
    import {getLocalStorageKey, setLocalStorageKey} from "../utils/storage";
    import {openSidecar} from "../utils/sidecar";

    const state = writable({
        loading: true,
        successfullyLoaded: false,
        loadedFromCache: false,
        sidecarProcess: null,
    })

    let configurationOptions = [];

    const onFormSubmit = async () => {
        try {
            const result = createConfiguration(configurationOptions);
            await saveConfiguration(result);
            ToastStore.addToast(ToastStore.severity.SUCCESS, 'Success saving configuration. Please restart SteamVR for the changes to take effect.');
        } catch (e) {
            console.trace(e);
            if (Array.isArray(e))
                e.forEach(v => ToastStore.addToast(ToastStore.severity.ERROR, v));
            else
                ToastStore.addToast(ToastStore.severity.ERROR, e);
        }
    }

    const awaitSidecarInit = () => new Promise((resolve, reject) => {
        openSidecar('sidecar', e => {
            console.log(e);
            resolve(e)
        }, e => reject(e)).then(child => $state.sidecarProcess = child);
    })

    const init = async () => {
        $state.loading = true;

        if ($state.sidecarProcess) $state.sidecarProcess.kill();
        try {
            await awaitSidecarInit();
            let fromCache;
            ({configurationOptions, fromCache} = await getConfiguration());
            $state.loadedFromCache = fromCache;

            const driver_openglove = configurationOptions.driver_openglove.options;

            if (!(getLocalStorageKey('initialised') === 'true') && !driver_openglove.left_enabled && !driver_openglove.right_enabled) {
                SplashStore.addSplash(Init, {
                    onActivate: async () => {
                        setLocalStorageKey('initialised', true);
                        driver_openglove.left_enabled = true;
                        driver_openglove.right_enabled = true;
                        await onFormSubmit();
                        SplashStore.popSplash();
                    }
                });
            }

            if (!fromCache) ToastStore.addToast(ToastStore.severity.SUCCESS, 'Successfully loaded configuration');
            $state.loading = false;
            $state.successfullyLoaded = true;
        } catch (e) {
            $state.loading = false;
            $state.successfullyLoaded = false;
            console.error(e);
            ToastStore.addToast(ToastStore.severity.ERROR, e);
        }
    }

    onMount(async () => {
        await init();
    });

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
<div class="flex-grow max-w-md my-10 w-full">
    <div class="w-full flex flex-col justify-center items-center">
        <div class="mx-10 w-full overflow-auto">
            <h2 class="mb-5 text-center text-3xl font-extrabold  ">
                Driver Configuration
            </h2>
            <div class="shadow rounded">
                <div class="px-4 py-5 space-y-6">
                    <Suspense suspense={$state.loading}>
                        {#if $state.successfullyLoaded}
                            {#each Object.entries(configurationOptions) as [key, value], i}
                                <div>
                                    <Accordion title={value.title}>
                                        {#if Array.isArray(value.options)}
                                            <Select
                                                    onSelectItemChanged={selectedKey => {
                                        configurationOptions[primaryConfigurationSection].options[key] = selectedKey;
                                    }}
                                                    options={Object.entries(value.options).map(([k, v]) => ({
                                        title: v.title,
                                        value: parseInt(k),
                                    }))}
                                                    defaultValue={configurationOptions[primaryConfigurationSection].options[key]}
                                            />
                                            <ConfigList
                                                    bind:configItems={value.options[configurationOptions[primaryConfigurationSection].options[key]].options}/>
                                        {:else}
                                            <ConfigList
                                                    hiddenKeys={Object.keys(configurationOptions).map((k) => k)}
                                                    bind:configItems={configurationOptions[key].options}
                                            />
                                        {/if}
                                    </Accordion>
                                </div>

                            {/each}
                            <div class="flex flex-row px-4">
                                <OrangeButton onClick={copyConfigurationToClipboard}>Copy Config to Clipboard
                                </OrangeButton>
                                <div class="flex-grow"></div>
                                <SuspenseButton onClick={onFormSubmit}>Save</SuspenseButton>
                            </div>
                        {:else}
                            <div class="flex items-center justify-center">
                                <OrangeButton onClick={init}>Retry Load</OrangeButton>
                            </div>
                        {/if}
                    </Suspense>

                </div>
            </div>
        </div>
    </div>
</div>