<script>
    import ToastStore from '../../stores/toast';

    export let severity = ToastStore.severity.SUCCESS;
    export let message = '';

</script>
{#if severity === ToastStore.severity.SUCCESS}
    <div class="flex items-center bg-green-500 border-l-4 border-green-700 py-2 px-3 shadow-md mb-2">
        <div class="text-green-500 rounded-full bg-white mr-3">
            <svg width="1.8em" height="1.8em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor"
                 xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                      d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
            </svg>
        </div>
        <!-- message -->
        <div class="text-white max-w-xs ">
            {message}
        </div>
    </div>
{/if}
{#if severity === ToastStore.severity.WARNING}
    <div class="flex items-center bg-purple-500 border-l-4 border-purple-700 py-2 px-3 shadow-md mb-2">
        <!-- icons -->
        <div class="text-purple-500 rounded-full bg-white mr-3">
            <svg width="1.8em" height="1.8em" viewBox="0 0 16 16" class="bi bi-exclamation" fill="currentColor"
                 xmlns="http://www.w3.org/2000/svg">
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
            </svg>
        </div>
        <!-- message -->
        <div class="text-white max-w-xs">
            {message}
        </div>
    </div>
{/if}

{#if severity === ToastStore.severity.ERROR}
    <div class="flex items-center bg-red-500 border-l-4 border-red-700 py-2 px-3 shadow-md mb-2">
        <!-- icons -->
        <div class="text-red-500 rounded-full bg-white mr-3">
            <svg width="1.8em" height="1.8em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor"
                 xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                      d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
                <path fill-rule="evenodd"
                      d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
            </svg>
        </div>
        <!-- message -->
        <div class="text-white max-w-xs ">
            {message}
        </div>
    </div>
{/if}
