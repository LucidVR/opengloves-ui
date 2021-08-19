<script>
    import {writable} from "svelte/store";
    import {openSidecar} from "../../utils/sidecar";
    import ToastStore from "../../stores/toast";
    import Select from "../Input/Select.svelte";
    import SuspenseButton from "../Input/Button/SuspenseButton.svelte";

    const state = writable({
            form: {
                calibrationTimer: 5,
                rightHand: true,
            },
            loading: false,
    });

    const beginCalibration = async (extend) => {
        try {
            $state.loading = true;
            const result = await openSidecar('sidecar', 'functions_servotest', {
                extend,
                right_hand: $state.form.rightHand
            });
            ToastStore.addToast(ToastStore.severity.SUCCESS, result.pop());
            $state.loading = false;
        } catch (e) {
            $state.loading = false;
            console.trace(e);
            ToastStore.addToast(ToastStore.severity.ERROR, 'Error starting servo calibration. Make sure that the driver is running: ' + e);
        }

    };
</script>

<tr>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        Servo Testing for Manual Calibration
    </td>
    <td class="px-6 py-4 text-sm text-gray-500">
        Calibrate your servos for Force Feedback. The buttons on the right give the options to either extend the servos
        fully, or retract them fully. As a guide, when the servos extended all the way, place the servo horn to where you
        want the fingers to be fully restricted. Then, retract the servos. They should not impede on any finger movement.
        <div class="m-3">
            <Select options={[{title: 'Left Hand', value: false}, {title: 'Right Hand', value: true}]}
                    onSelectItemChanged={v => $state.autoCalibrate.form.rightHand = v}
                    defaultValue={true} label="For Hand"/>
        </div>

    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex flex-col">
        <div class="my-3">
            <SuspenseButton onClick={async () => beginCalibration(true)}>
                Extend Servos fully
            </SuspenseButton>
        </div>

        <div class="my-3">
            <SuspenseButton onClick={async () => beginCalibration(false)}>
                Retract Servos fully
            </SuspenseButton>
        </div>
    </td>
</tr>