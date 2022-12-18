<script>
	import PoseCalibration, {
		title as pose_title,
		description as pose_description
	} from '$lib/functions/PoseCalibration.svelte';

	import ServoCalibration, {
		title as servo_title,
		description as servo_description
	} from '$lib/functions/ServoCalibration.svelte';

	import Reset, {
		title as reset_title,
		description as reset_description
	} from '$lib/functions/Reset.svelte';
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
								Action
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-500 dark:bg-gray-700">
						<tr>
							<td class="px-6 py-4 text-sm"> <strong>{reset_title}</strong> <br><br> {reset_description}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm flex flex-col">
								<Reset />
							</td>
						</tr>

						<tr>
							<td class="px-6 py-4 text-sm"> <strong>{pose_title}</strong> <br><br> {pose_description}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm flex flex-col">
								<PoseCalibration />
							</td>
						</tr>

						<tr>
							<td class="px-6 py-4 text-sm"> <strong>{servo_title}</strong> <br><br> {servo_description}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm flex flex-col">
								<ServoCalibration />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
