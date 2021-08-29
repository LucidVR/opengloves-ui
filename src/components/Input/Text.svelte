<script>
    import {FontAwesomeIcon} from 'fontawesome-svelte';
    import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
    import ToolTip from '../ToolTip.svelte';
    import configurationOptionStrings from '../../strings/configuration_options.json';
    import {prettyPrintLabel} from "../../utils/string";

    export let label = '';
    export let value;

    let isNumber = typeof value === 'number';
</script>

<div class="flex flex-col flex-grow py-1">
    <div class="flex flex-row">
        <p class="block text-sm font-medium text-gray-700">
            {configurationOptionStrings[label]?.title ?? prettyPrintLabel(label)}
        </p>
        <div class="px-1">
            {#if configurationOptionStrings[label]?.description}
                <ToolTip title={configurationOptionStrings[label].description}>
                    <FontAwesomeIcon icon={faQuestionCircle}/>
                </ToolTip>
            {/if}
        </div>
    </div>

    <div class="mt-1 flex rounded-md shadow-sm">
        {#if isNumber}
            <input type="number" name="text-input" bind:value={value}
                   class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block rounded text-sm border-gray-300"
                   placeholder="{value}">
        {:else}
            <input type="text" name="text-input" bind:value={value}
                   class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block rounded text-sm border-gray-300"
                   placeholder="{value}">
        {/if}

    </div>
</div>