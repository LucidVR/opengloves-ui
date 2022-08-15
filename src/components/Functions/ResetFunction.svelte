<script>
  import SuspenseButton from "../Input/Button/SuspenseButton.svelte";
  import ToastStore from "../../stores/toast";
  import { setLocalStorageKey } from "../../utils/storage";
  import { process } from "@tauri-apps/api";

  const resetConfiguration = async () => {
    try {
      // const defaultConfig = await readDefaultConfiguration();
      //
      // await saveConfiguration(defaultConfig);
      // setLocalStorageKey("initialised", false);

      ToastStore.addToast(
        ToastStore.severity.SUCCESS,
        "Success resetting configuration. Restarting the app in 3 secs..."
      );

      window.setTimeout(() => process.relaunch(), 3000);
    } catch (e) {
      console.trace(e);
      ToastStore.addToast(
        ToastStore.severity.ERROR,
        "There was an error resetting configuration: " + e.message
      );
    }
  };
</script>

<tr>
  <td class="px-6 py-4 whitespace-nowrap text-sm"> Reset Configuration </td>
  <td class="px-6 py-4 text-sm">
    <b>Reset Configuration to default</b>
    <br />
    If you've somehow messed up your configuration, reset it to default.
  </td>
  <td class="px-6 py-4 whitespace-nowrap text-sm flex flex-col">
    <div class="my-3">
      <SuspenseButton onClick={resetConfiguration} colour="red">
        Reset Configuration
      </SuspenseButton>
    </div>
  </td>
</tr>
