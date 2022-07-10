import { writable } from "svelte/store";

const CreateSplashScreen = () => {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    addSplash: (component, props) =>
      update((e) => {
        e.push({ component, props });
        return e;
      }),
    popSplash: () =>
      update((e) => {
        e.shift();

        return e;
      }),
  };
};

export default CreateSplashScreen();
