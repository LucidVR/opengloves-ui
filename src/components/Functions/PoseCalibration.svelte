<script>
    import {writable} from "svelte/store";
    import {openSidecar} from "../../utils/sidecar";
    import ToastStore from "../../stores/toast";
    import Select from "../Input/Select.svelte";
    import Text from "../Input/Text.svelte";
    import SuspenseButton from "../Input/Button/SuspenseButton.svelte";

    const state = writable({
            form: {
                calibrationTimer: 5,
                rightHand: true,
            },
            timer: null,
            calibrating: false,
            loading: false,
    });

    const beginCalibration = async () => {
        $state.calibrating = true;
        $state.timer = $state.form.calibrationTimer;

        try {
            await openSidecar('sidecar', 'functions_autocalibrate', {
                start: true,
                right_hand: $state.form.rightHand
            });
            const interval = setInterval(() => {
                if ($state.timer <= 0) {
                    clearInterval(interval);
                    openSidecar('sidecar', 'functions_autocalibrate', {
                        start: false,
                        right_hand: $state.form.rightHand
                    }).then(d => {
                        ToastStore.addToast(ToastStore.severity.SUCCESS, 'Finished calibration!');
                        $state.calibrating = false;
                        $state.loading = false;
                    });

                } else $state.timer = $state.timer - 1;
            }, 1000);

        } catch (e) {
            $state.calibrating = false;
            $state.loading = false;
            console.trace(e);
            ToastStore.addToast(ToastStore.severity.ERROR, 'Error starting calibration. Make sure that the driver is running: ' + e);
        }

    };
</script>

<tr>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        Pose Auto-Calibration
    </td>
    <td class="px-6 py-4 text-sm text-gray-500">
        <div class="mb-3">
            <Select options={[{title: 'Left Hand', value: false}, {title: 'Right Hand', value: true}]}
                    onSelectItemChanged={v => $state.form.rightHand = v}
                    defaultValue={true} label="For Hand"/>
            <div class="m-3"></div>
            <Text label="Timer (Delay time)" bind:value={$state.form.calibrationTimer}/>
        </div>
        Automatically calibrate your controller offsets. Clicking the button will start a 10 second
        timer and will freeze your in-game hand.
        During the delay, move your hand to the position of the hand in-game. Once the timer
        is up, you should see your virtual hand move with your real hand.
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex flex-row">
        <SuspenseButton onClick={async () => beginCalibration()}
                        disabled={$state.calibrating}>
            {#if $state.calibrating}
                {$state.timer}
            {:else}
                Start Auto-Calibration
            {/if}
        </SuspenseButton>
    </td>
</tr>