<script>
    import DefaultButton from '../components/Input/Button/DefaultButton.svelte';
    import ToastStore from '../stores/toast';
    import Text from "../components/Input/Text.svelte";
    import {writable} from "svelte/store";
    import Select from "../components/Input/Select.svelte";
    import {openSidecar} from "../utils/sidecar";
    import Toast from "../components/Toast.svelte";
    import SuspenseButton from "../components/Input/Button/SuspenseButton.svelte";

    const state = writable({
        autoCalibrate: {
            form: {
                calibrationTimer: 5,
                forRightHand: true,
            },
            timer: null,
            isCalibrating: false,
            loading: false,
        }
    });

    const beginCalibration = async () => {
        $state.autoCalibrate.isCalibrating = true;
        $state.autoCalibrate.timer = $state.autoCalibrate.form.calibrationTimer;

        try {
            await openSidecar('sidecar', 'functions_autocalibrate', {
                start: true,
                right_hand: $state.autoCalibrate.form.forRightHand
            });
            const interval = setInterval(() => {
                if ($state.autoCalibrate.timer <= 0) {
                    openSidecar('sidecar', 'functions_autocalibrate', {
                        start: false,
                        right_hand: $state.autoCalibrate.form.forRightHand
                    }).then(d => {
                        clearInterval(interval);
                        ToastStore.addToast(ToastStore.severity.SUCCESS, 'Finished calibration!');
                        $state.autoCalibrate.isCalibrating = false;
                        $state.autoCalibrate.loading = false;
                    });

                } else $state.autoCalibrate.timer = $state.autoCalibrate.timer - 1;
            }, 1000);

        } catch (e) {
            $state.autoCalibrate.isCalibrating = false;
            $state.autoCalibrate.loading = false;
            console.trace(e);
            ToastStore.addToast(ToastStore.severity.ERROR, 'Error starting calibration. Make sure that the driver is running!: ' + e);
        }

    };

    const getComPorts = () => {
        ToastStore.addToast(ToastStore.severity.WARNING, "This function hasn't yet been implemented");
    }
</script>

<div class="flex flex-col w-full z-10">
    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                <tr>
                    <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Function
                    </th>
                    <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                    </th>
                    <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                    </th>
                </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Auto Calibrate
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                        Automatically calibrate your controller offsets. Clicking the button will start a 10 second
                        timer and will freeze your in-game hand.
                        During the delay, move your hand to the position of the hand in-game. Once the timer
                        is up, you should see your virtual hand move with your real hand.
                        <div class="m-3">
                            <Select options={[{title: 'Left Hand', value: false}, {title: 'Right Hand', value: true}]}
                                    defaultValue={true} label="For Hand"/>
                            <div class="m-3"></div>
                            <Text label="Timer (Delay time)" bind:value={$state.autoCalibrate.form.calibrationTimer}/>
                        </div>

                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex flex-row">
                        <SuspenseButton onClick={async () => beginCalibration()}
                                        disabled={$state.autoCalibrate.isCalibrating}>
                            {#if $state.autoCalibrate.isCalibrating}
                                {$state.autoCalibrate.timer}
                            {:else}
                                Start Auto-Calibration
                            {/if}
                        </SuspenseButton>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>