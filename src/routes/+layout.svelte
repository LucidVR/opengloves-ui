<script lang="ts">
	import '../app.postcss';

	import { flip } from 'svelte/animate';
	import { ToastStore, Severity } from '$lib/stores/toast';

	import Toast from '$lib/components/alert/Toast.svelte';

	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { writable } from 'svelte/store';

	interface VisibleToastInterface {
		id: number;
		message: string;
		severity: Severity;
	}

	const state = writable({
		visible_toasts: <Array<VisibleToastInterface>>[],
		current_toast: 0
	});

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	ToastStore.subscribe((e) => {
		//we have received a toast update
		if (e.length > $state.visible_toasts.length) {
			//last toast added
			$state.visible_toasts = [
				...$state.visible_toasts,
				{
					message: e[e.length - 1].message,
					severity: e[e.length - 1].severity,
					id: $state.current_toast++
				}
			];

			window.setTimeout(
				() => {
					$state.visible_toasts = $state.visible_toasts.slice(1, $state.visible_toasts.length);
					ToastStore.pop_toast();

					//success or error timeout length
				},
				e[e.length - 1].severity === 2 ? 2000 : 5000
			);
		}
	});
</script>

<div class="fixed right-0 top-0 m-5 z-50 w-2/3">
	{#each $state.visible_toasts as toast, index (toast.id)}
		<div in:receive={{ key: toast.id }} out:send={{ key: toast.id }} animate:flip>
			<Toast message={toast.message} severity={toast.severity} />
		</div>
	{/each}
</div>

<slot />
