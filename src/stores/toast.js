import {writable} from "svelte/store";

const severity = {
    ERROR: 0,
    WARNING: 1,
    SUCCESS: 2,
};

//Overlays are pages which should show on top of a page which is currently open, like a login page, as we want to stay on the same page as before.
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
