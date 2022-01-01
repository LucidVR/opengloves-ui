<script>
    import {open} from '@tauri-apps/api/shell';

    export let url = "";

    export let colour = 'blue';
</script>

<a class="cursor-pointer text-{colour}-500" on:click={() => open(url)}><slot/></a>