<script>
	import PoseCalibration from '../components/Functions/PoseCalibrationFunction.svelte';
	import ServoCalibration from '../components/Functions/ServoCalibrationFunction.svelte';
	import Reset from '../components/Functions/ResetFunction.svelte';

	const function_list = [Reset, PoseCalibration, ServoCalibration];
</script>

<div class="flex-grow my-10">
	<div class="flex flex-col">
		<h2 class="mb-5 text-center text-3xl font-extrabold">Functions</h2>
		<div class="py-2 align-middle inline-block sm:px-6 lg:px-8">
			<div class="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
				<table class="divide-y divide-gray-200 dark:divide-gray-900">
					<thead class="bg-gray-50 dark:bg-gray-800">
						<tr>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
							>
								Function
							</th>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
							>
								Description
							</th>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
							>
								Action
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-500 dark:bg-gray-700">
						{#each functionList as functionItem}
							<svelte:component this={functionItem} />
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
