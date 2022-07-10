<script>
  import { writable } from "svelte/store";
  import ToastStore from "../../stores/toast";
  import Select from "../Input/Select.svelte";
  import SuspenseButton from "../Input/Button/SuspenseButton.svelte";
  import { makeHTTPRequest } from "../../utils/http";

  const state = writable({
    form: {
      rightHand: true,
    },
    loading: false,
  });

  const servoTest = async (extend) => {
    try {
      $state.loading = true;
      const result = await makeHTTPRequest("functions/servo_test", "POST", {
        extend,
        right_hand: $state.form.rightHand,
      });
      ToastStore.addToast(ToastStore.severity.SUCCESS, result);
      $state.loading = false;
    } catch (e) {
      $state.loading = false;
      console.trace(e);
      ToastStore.addToast(ToastStore.severity.ERROR, e);
    }
  };
</script>

<tr>
  <td class="px-6 py-4 whitespace-nowrap text-sm">
    Servo Testing for Manual Calibration
  </td>
  <td class="px-6 py-4 text-sm">
    <div class="mb-3">
      <Select
        options={[
          { title: "Left Hand", value: false },
          { title: "Right Hand", value: true },
        ]}
        onSelectItemChanged={(v) => ($state.form.rightHand = v)}
        defaultValue={true}
        label="For Hand"
      />
    </div>
    <b>Test or Calibrate your servos for Force Feedback:</b>
    <br />
    The buttons on the right give the options to either extend the servos fully,
    or retract them fully. As a guide, extend the servos fully, then place the servo
    horn to where you want the fingers to be fully restricted. After, retract the
    servos. They should not impede on any finger movement.
  </td>
  <td class="px-6 py-4 whitespace-nowrap text-sm flex flex-col">
    <div class="my-3">
      <SuspenseButton onClick={async () => servoTest(true)}>
        Extend Servos fully
      </SuspenseButton>
    </div>

    <div class="my-3">
      <SuspenseButton onClick={async () => servoTest(false)}>
        Retract Servos fully
      </SuspenseButton>
    </div>
  </td>
</tr>
