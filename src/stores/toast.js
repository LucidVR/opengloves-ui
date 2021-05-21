import {writable} from "svelte/store";

const severity = {
    ERROR: 0,
    WARNING: 1,
    SUCCESS: 2,
};

const CreateToastStore = () => {
    const {subscribe, set, update} = writable([]);

    return {
        subscribe,
        addToast: (severity, message) => update(e => {
            e.push({severity, message});
            return e;
        }),
        popToast: () => update(e => {
            e.shift();

            return e;
        }),
        severity,
    }
}

export default CreateToastStore();
