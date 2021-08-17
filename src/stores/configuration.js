import {writable} from 'svelte/store';

const CreateConfigurationStore = () => {
    const {subscribe, set, update} = writable(null);

    return {
        getConfiguration: () => new Promise(resolve => {
            const sub = subscribe(e => {
                resolve(e);
            });
            sub();
        }),
        set,
        update,
        subscribe
    }
};

export default CreateConfigurationStore();