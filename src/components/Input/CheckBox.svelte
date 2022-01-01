<script>
    import Fa from 'svelte-fa';
    import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
    import ToolTip from '../ToolTip.svelte';
    import configurationOptionStrings from '../../strings/configuration_options.json';
    import {prettyPrintLabel} from "../../utils/string";

    export let label = '';
    export let checked = false;
</script>

<div class="flex flex-row">
    <label class="flex items-center space-x-3 my-2">
        <input type="checkbox" bind:checked={checked} name="checkbox"
               class="form-tick appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-600 checked:border-transparent focus:outline-none cursor-pointer">
        <span class="text-gray-900 font-medium text-sm">{configurationOptionStrings[label]?.title ?? prettyPrintLabel(label)}</span>
    </label>
    {#if configurationOptionStrings[label]?.description}
        <div class="p-2">
            <ToolTip text={configurationOptionStrings[label].description}>
                <Fa icon={faQuestionCircle}/>
            </ToolTip>
        </div>
    {/if}
</div>
