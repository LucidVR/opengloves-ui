<script>
    import Configuration from './pages/Configuration.svelte';
    import Functions from "./pages/Functions.svelte";

    import ToastStore from './stores/toast';
    import {flip} from 'svelte/animate';
    import {crossfade} from 'svelte/transition';
    import {quintOut} from 'svelte/easing';
    import {open} from '@tauri-apps/api/shell';

    import ToastComponent from './components/Toast.svelte';
    import Menu from "./components/Menu.svelte";

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
    })

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
    const menuItemComponents = [Configuration, Functions];
</script>
<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>

<div class="fixed right-0 top-0 m-5 z-50">
    {#each visibleToasts as [message, severity, id, ToastComponent], index (id)}
        <div in:receive="{{key: id}}"
             out:send="{{key: id}}"
             animate:flip>
            <ToastComponent message={message} severity={severity}/>
        </div>
    {/each}
</div>

<div id="content" class="font-sans min-h-screen flex flex-col justify-center items-center bg-gray-50 overflow-hidden">
    <Menu items={['Configuration', 'Functions']} bind:active={activeMenuItem}/>
    <svelte:component this={menuItemComponents[activeMenuItem]}/>
    <footer class="p-4 text-center flex flex-row items-end">
        <h3 on:click={() => open('https://github.com/LucidVR/opengloves-ui')}
            class="cursor-pointer text-blue-500">
            Source code licenced under MIT
        </h3>
    </footer>
</div>

