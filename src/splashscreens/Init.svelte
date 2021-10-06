<script>
    import RedButton from "../components/Input/Button/RedButton.svelte";

    import {process} from "@tauri-apps/api";
    import SuspenseButton from "../components/Input/Button/SuspenseButton.svelte";

    export let onActivate = () => {};
</script>

<div class="max-w-md text-center">
    <p class="text-4xl font-bold">Activate OpenGloves?</p>
    <p class="text-xl font-bold">OpenGloves is not a VR Game!</p>
    <p class="mt-5">OpenGloves is a SteamVR Driver for Virtual Reality Gloves, it is <b>not</b> a free VR game on Steam.</p>
    <p class="mt-2">
        <b>If you know this already</b>, continue to activate the driver.
    </p>
    <p class="mt-2">
        <b>If you didn't know this</b>, do not activate the driver. Doing so will have unintended
        consequences on your VR controller setup, most likely making your controllers unusable.
        We <u>strongly recommend uninstalling OpenGloves</u> if you don't need the application.
    </p>
    <div class="flex flex-row mt-5 justify-between">
        <SuspenseButton onClick={async () => await onActivate()}>Activate the Driver</SuspenseButton>
        <RedButton onClick={() => process.exit()}>Get me out of here!</RedButton>
    </div>
</div>
