<script>
  import { createConfiguration, extractItems, getConfiguration, saveConfiguration } from './utils/configurationHandler'
  import ToastStore from './stores/toast'

  import Select from './components/Select.svelte'
  import { writable } from 'svelte/store'
  import { onMount } from 'svelte'
  import Accordion from './components/Accordion/Accordion.svelte'
  import ConfigList from './components/Config/ConfigList.svelte'
  import DefaultButton from './components/Button/DefaultButton.svelte'
  import OrangeButton from './components/Button/OrangeButton.svelte'
  import { getSettingsPath } from './utils/configurationHandler'

  const formData = writable({
    driver_config: {
      left_enabled: true,
      right_enabled: true,
      communication_protocol: 0,
      device_driver: 0,
      encoding_protocol: 0,
    },
  })

  let configurationOptions = []
  let configurationItems = {}

  onMount(async () => {
    try {
      const result = await getConfiguration();
      configurationItems = result

      configurationOptions = extractItems(result)
      ToastStore.addToast(ToastStore.severity.SUCCESS, 'Successfully loaded configuration')
    } catch (e) {
      console.trace(e)
      ToastStore.addToast(ToastStore.severity.ERROR, 'Unable to load configuration, please open an issue on GitHub: ' + e.message)
    }
  });



  const onFormSubmit = async () => {
    try {
      const result = createConfiguration(configurationOptions, configurationItems);
      await saveConfiguration(result);
      ToastStore.addToast(ToastStore.severity.SUCCESS, 'Success saving configuration. Please restart SteamVR for the changes to take effect.')
    } catch (e) {
      console.trace(e)
      ToastStore.addToast(ToastStore.severity.ERROR, 'Unable to save configuration, please open an issue on GitHub: ' + e.message)
    }
  }

  const copyConfigurationToClipboard = () => {
    try {
      const result = createConfiguration(configurationOptions, configurationItems);

      const el = document.createElement('textarea');
      el.value = result;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

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
            <div class="flex flex-row px-4">
                <OrangeButton text="Copy Config to Clipboard" onClick={copyConfigurationToClipboard} />
                <div class="flex-grow"></div>
                <DefaultButton text="Save" onClick={onFormSubmit} />
            </div>
        </div>
    </div>

</div>
