<script>
    import ToastStore from '../stores/toast';
    import SplashStore from '../stores/splash';
    import SettingsStore from '../stores/settings';

    import {flip} from 'svelte/animate';
    import {crossfade} from 'svelte/transition';
    import {quintOut} from 'svelte/easing';

    import ToastComponent from '../components/Toast.svelte';
    import Menu from "../components/Menu.svelte";
    import Footer from "../components/Footer.svelte";
    import {goto, isActive, url} from "@roxi/routify";
    import {writable} from "svelte/store";
    import {openSidecar} from "../utils/sidecar";
    import {onMount} from "svelte";
    import Suspense from "../components/Suspense.svelte";
    import OrangeButton from "../components/Input/Button/OrangeButton.svelte";

    const _urls = [
        ["./index", "Configuration"],
        ["./functions", "Functions"],
        ["./settings", "Settings"],
    ];

    const state = writable({
        sidecar: {
            loading: true,
            success: false,
            process: null,
        },
        visibleToasts: [],
        activeMenuItem: 0
    });

    const [send, receive] = crossfade({
        duration: d => Math.sqrt(d * 200),

        fallback(node, params) {
            const style = getComputedStyle(node)
            const transform = style.transform === 'none' ? '' : style.transform

            return {
                duration: 600,
                easing: quintOut,
                css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
            }
        }
    });

    ToastStore.subscribe(e => {
        //we have received a toast update
        if (e.length > $state.visibleToasts.length) {
            //last toast added
            $state.visibleToasts = [...$state.visibleToasts, [e[e.length - 1].message, e[e.length - 1].severity, Math.random(), ToastComponent]];

            window.setTimeout(() => {
                $state.visibleToasts = $state.visibleToasts.slice(1, $state.visibleToasts.length);
                ToastStore.popToast();

                //success or error timeout length
            }, e[e.length - 1].severity === 2 ? 2000 : 5000);
        }
    });

    $: urls = _urls.map(([path, title]) => ({
        title,
        href: $url(path),
        onClick: () => $goto(path),
        active: !!$isActive(path),
    }));

    const awaitSidecarInit = (onChildSet) => new Promise((resolve, reject) => {
        openSidecar('sidecar', e => resolve(e), e => reject(e)).then(onChildSet);
    });

    const init = async () => {
        try {
            $state.sidecar.loading = true;
            if ($state.sidecar.process) $state.sidecar.process.kill();

            await awaitSidecarInit((child) => $state.sidecar.process = child);
            $state.sidecar.success = true;
        } catch (e) {
            console.error(e);
            $state.sidecar.success = false;
            ToastStore.addToast(ToastStore.severity.ERROR, e);
        } finally {
            $state.sidecar.loading = false;
        }
    }

    onMount(init);
</script>

<div class="fixed right-0 top-0 m-5 z-50">
    {#each $state.visibleToasts as [message, severity, id, ToastComponent], index (id)}
        <div in:receive="{{key: id}}"
             out:send="{{key: id}}"
             animate:flip>
            <ToastComponent message={message} severity={severity}/>
        </div>
    {/each}
</div>

<div class="{$SettingsStore[SettingsStore.SETTINGS_OPTION.UI_THEME] === 'dark' ? 'dark' : ''}">

    <div class="font-sans min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 overflow-hidden dark:text-gray-300 text-gray-800">
        {#if $SplashStore.length > 0}
            <svelte:component this={$SplashStore[$SplashStore.length-1].component}
                              {...$SplashStore[$SplashStore.length - 1].props}/>
        {:else}
                <Suspense suspense={$state.sidecar.loading}>
                    {#if $state.sidecar.success}
                        <Menu items={urls} bind:active={$state.activeMenuItem}/>
                        <slot/>
                        <Footer/>
                    {:else}
                        <div class="h-full w-full flex items-center justify-center">
                            <OrangeButton onClick={init}>Retry Load</OrangeButton>
                        </div>
                    {/if}
                </Suspense>
        {/if}
    </div>

</div>

