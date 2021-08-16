<script>
    export let label = '';
    export let checked = false;
</script>

<label class="flex items-center space-x-3 my-2">
    <input type="checkbox" bind:checked={checked} name="checkbox" class="form-tick appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-600 checked:border-transparent focus:outline-none">
    <span class="text-gray-900 font-medium text-sm">{label}</span>
</label>