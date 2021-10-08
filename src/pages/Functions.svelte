<script>
    import {fly} from "svelte/transition";

    import PoseCalibration from "../components/Functions/PoseCalibrationFunction.svelte";
    import ServoCalibration from "../components/Functions/ServoCalibrationFunction.svelte";
    import Reset from "../components/Functions/ResetFunction.svelte";

    const functionList = [Reset, PoseCalibration, ServoCalibration];
</script>

<div class="flex-grow my-10 w-full">
    <div class="flex flex-col" in:fly="{{x: 300, delay:400}}" out:fly="{{x: 300}}">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg" >
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                    <tr>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Function
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                        </th>
                    </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                    {#each functionList as functionItem}
                        <svelte:component this={functionItem}/>
                    {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
