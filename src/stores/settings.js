import {writable} from "svelte/store";
import {getLocalStorageKey, setLocalStorageKey} from "../utils/storage";

const SETTINGS_OPTION = {
    UI_THEME: 'setting_ui_theme',
};

const SETTINGS_DEFAULTS = {
    'setting_ui_theme': 'dark'
}

const CreateSettingsStore = () => {
    let currentSettings = {};
    for (const [key, value] of Object.entries(SETTINGS_OPTION)) {
        currentSettings[value] = getLocalStorageKey(value) ?? SETTINGS_DEFAULTS[value];
    }

    const {subscribe, set, update} = writable(currentSettings);

    return {
        subscribe,
        setSetting: (settingsOption, value) => {
            setLocalStorageKey(settingsOption, value);
            update(e => {
                e[settingsOption] = value;
                return e;
            })
        },
        SETTINGS_OPTION,
    }
}

export default CreateSettingsStore();
