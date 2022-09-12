import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const enum Severity {
	ERROR,
	WARNING,
	SUCCESS
}

export type ToastItem = { severity: Severity; message: string };

type ToastStore = {
	subscribe: Writable<Array<ToastItem>>['subscribe'];

	add_toast: (severity: Severity, message: string) => void;
	pop_toast: () => void;
};

function createToastStore(): ToastStore {
	const { subscribe, set, update } = writable<Array<ToastItem>>([]);
	return {
		subscribe,

		add_toast: (severity: Severity, message: string) =>
			update((e) => {
				e.push({ severity, message });
				return e;
			}),

		pop_toast: () =>
			update((e) => {
				e.shift();

				return e;
			})
	};
}

export const ToastStore = createToastStore();
