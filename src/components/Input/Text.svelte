<script>
  import Fa from "svelte-fa";
  import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
  import ToolTip from "../ToolTip.svelte";

  export let label = "";
  export let value;
  export let description;

  let isNumber = typeof value === "number";
</script>

<div class="flex flex-col flex-grow py-1">
  <div class="flex flex-row">
    <p class="block text-sm font-medium">
      {label}
    </p>
    {#if description}
      <div class="px-1">
        <ToolTip text={description}>
          <Fa icon={faQuestionCircle} color="grey" />
        </ToolTip>
      </div>
    {/if}
  </div>

  <div class="mt-1 flex rounded-md shadow-sm">
    {#if isNumber}
      <input
        type="number"
        name="text-input"
        bind:value
        class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block rounded text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-600 "
        placeholder={value}
      />
    {:else}
      <input
        type="text"
        name="text-input"
        bind:value
        class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block rounded text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-600"
        placeholder={value}
      />
    {/if}
  </div>
</div>
