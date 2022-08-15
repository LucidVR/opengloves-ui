<script>
  import {
    getConfiguration,
    primaryConfigurationSection,
    saveConfiguration
  } from "../utils/configuration";
  import ToastStore from "../stores/toast";
  import SplashStore from "../stores/splash";

  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import Accordion from "../components/Accordion.svelte";
  import ConfigList from "../components/Config/ConfigList.svelte";
  import OrangeButton from "../components/Input/Button/OrangeButton.svelte";

  import SuspenseButton from "../components/Input/Button/SuspenseButton.svelte";
  import Suspense from "../components/Suspense.svelte";
  import ConfigItem from "../components/Config/ConfigItem.svelte";

  const state = writable({
    loading: true,
    successfullyLoaded: false,
    sidecarProcess: null,
    configurationOptions: []
  });

  const onFormSubmit = async () => {
    // try {
    //   const result = createConfiguration($state.configurationOptions);
    //   await saveConfiguration(result);
    //   ToastStore.addToast(
    //     ToastStore.severity.SUCCESS,
    //     "Success saving configuration and applied changes to driver!"
    //   );
    // } catch (e) {
    //   console.trace(e);
    //   if (Array.isArray(e))
    //     e.forEach((v) => ToastStore.addToast(ToastStore.severity.ERROR, v));
    //   else ToastStore.addToast(ToastStore.severity.ERROR, e);
    // }
  };

  const init = async () => {
    $state.loading = true;
    try {
      $state.configurationOptions = JSON.parse(await getConfiguration());

      ToastStore.addToast(
        ToastStore.severity.SUCCESS,
        "Successfully loaded configuration"
      );
      $state.successfullyLoaded = true;
    } catch (e) {
      $state.successfullyLoaded = false;
      console.error(e);
      ToastStore.addToast(ToastStore.severity.ERROR, e);
    } finally {
      $state.loading = false;
    }
  };

  onMount(init);

  const copyConfigurationToClipboard = () => {
    try {
      //const result = createConfiguration($state.configurationOptions);

      //writeText(JSON.stringify(result));

      ToastStore.addToast(
        ToastStore.severity.SUCCESS,
        "Successfully copied to clipboard."
      );
    } catch (e) {
      console.trace(e);

      ToastStore.addToast(
        ToastStore.severity.ERROR,
        "Could not copy configuration to clipboard."
      );
    }
  };
</script>

<div class="flex-grow max-w-md my-10 w-full">
  <div class="w-full flex flex-col justify-center items-center">
    <div class="mx-10 w-full overflow-auto">
      <h2 class="mb-5 text-center text-3xl font-extrabold">
        Driver Configuration
      </h2>
      <div
        class="px-4 py-5 space-y-6 w-full flex flex-col justify-center items-center"
      >
        <Suspense suspense={$state.loading} message="Getting configuration...">
          {#if $state.successfullyLoaded}
            {#each Object.entries($state.configurationOptions) as [sectionKey, sectionValues], i}
              <Accordion title={sectionKey}>
                {#each Object.entries(sectionValues) as [configKey, configValue]}
                  <ConfigItem title={configKey} bind:value={configValue} />
                {/each}
              </Accordion>
            {/each}
            <div class="flex flex-row w-full">
              <OrangeButton onClick={copyConfigurationToClipboard}
              >Copy Config to Clipboard
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
