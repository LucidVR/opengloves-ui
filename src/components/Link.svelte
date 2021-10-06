<script>
    import {open} from '@tauri-apps/api/shell';

    export let url = "";
</script>

<a class="cursor-pointer text-blue-500" on:click={() => open(url)}><slot/></a>