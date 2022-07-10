<script>
  import { open } from "@tauri-apps/api/shell";

  export let url = "";

  export let colour = "blue-500";
</script>

<a class="cursor-pointer text-{colour}" on:click={() => open(url)}><slot /></a>
