<script>
    import { TabsTransition } from "@roxi/routify/decorators";

    import ToastStore from '../stores/toast';
    import SplashStore from '../stores/splash';

    import {flip} from 'svelte/animate';
    import {crossfade} from 'svelte/transition';
    import {quintOut} from 'svelte/easing';

    import ToastComponent from '../components/Toast.svelte';
    import Menu from "../components/Menu.svelte";
    import Footer from "../components/Footer.svelte";
    import {goto} from "@roxi/routify";

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

    let visibleToasts = []
    ToastStore.subscribe(e => {
        //we have received a toast update
        if (e.length > visibleToasts.length) {
            //last toast added
            visibleToasts = [...visibleToasts, [e[e.length - 1].message, e[e.length - 1].severity, Math.random(), ToastComponent]];

            window.setTimeout(() => {
                visibleToasts = visibleToasts.slice(1, visibleToasts.length);
                ToastStore.popToast();

                //success or error timeout length
            }, e[e.length - 1].severity === 2 ? 2000 : 5000);
        }
    });

    let activeMenuItem = 0;
</script>

<div class="fixed right-0 top-0 m-5 z-50">
    {#each visibleToasts as [message, severity, id, ToastComponent], index (id)}
        <div in:receive="{{key: id}}"
             out:send="{{key: id}}"
             animate:flip>
            <ToastComponent message={message} severity={severity}/>
        </div>
    {/each}
</div>

<div class="dark">
    <div class="font-sans min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 overflow-hidden dark:text-gray-300 text-gray-800">
        {#if $SplashStore.length > 0}
            <svelte:component this={$SplashStore[$SplashStore.length-1].component}
                              {...$SplashStore[$SplashStore.length - 1].props}/>
        {:else}
            <Menu items={[{
            title: 'Configuration',
            onClick: () => {
                $goto('./index');
            }
        },{
            title: 'Functions',
            onClick: () => {
                $goto('./functions');
            }
        }]} bind:active={activeMenuItem}/>
            <slot/>
        {/if}
        <Footer/>
    </div>

</div>

