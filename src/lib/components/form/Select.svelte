<script lang="ts">
	export let label: string;
	export let options: { title: string; value: boolean | string }[];

	export let selected_index = 0;
	export let selected_value = options[selected_index].value;

	$: selected_index = options.findIndex(e => e.value === selected_value);

	let visible = false;
</script>

<div class="z-30">
	<label id="listbox-label" class="block text-sm font-medium">
		{label}
	</label>
	<div class="mt-1 w-full relative">
		<button
			type="button"
			on:mousedown={() => (visible = !visible)}
			class="relative w-full bg-white border border-gray-300 dark:border-gray-600 dark:bg-gray-600 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
			aria-haspopup="listbox"
			aria-expanded="true"
			aria-labelledby="listbox-label"
		>
			<span class="ml-3 block truncate">
				{options[selected_index]?.title}
			</span>
			<span class="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
				<svg
					class="h-5 w-5 "
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</span>
		</button>
		<div class="absolute w-full">
			{#if visible && options.length > 0}
				<ul
					class="mt-1 w-full bg-white border-gray-300 dark:border-gray-800 dark:bg-gray-600 shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm cursor-pointer z-50"
					tabindex="-1"
					role="listbox"
					aria-labelledby="listbox-label"
				>
					{#each options as option, i}
						<li
							class="  cursor-default select-none relative py-2 pl-3 pr-9"
							id="listbox-option-0"
							on:click={() => {
								selected_index = i;
								selected_value = options[selected_index].value;
								visible = false;
							}}
							role="option"
						>
							<div class="flex items-center">
								<span class="font-normal ml-3 block truncate">
									{option.title}
								</span>
							</div>

							{#if selected_index === i}
								<span class="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
									<svg
										class="h-5 w-5"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
								</span>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</div>
