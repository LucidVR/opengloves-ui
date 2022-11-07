<script lang="ts">
	export let text: string;
	let is_hovered = false;
	let x;
	let y;

	const mouse_over = (event) => {
		is_hovered = true;
		x = event.pageX + 5;
		y = event.pageY + 5;
	};

	const mouse_move = (event) => {
		x = event.pageX + 5;
		y = event.pageY + 5;
	};

	const mouse_leave = () => {
		is_hovered = false;
	};
</script>

<div on:mouseover={mouse_over} on:mouseleave={mouse_leave} on:mousemove={mouse_move}>
	<slot />
</div>

{#if is_hovered}
	<div class="absolute mx-2 shadow" style="top: {y}px; left: {x}px;">
		<div class="bg-black text-gray-200 text-sm rounded py-1 px-4 right-0 bottom-full">
			{@html text}
		</div>
	</div>
{/if}
