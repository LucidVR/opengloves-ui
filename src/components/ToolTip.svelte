<script>
    export let text = '';
    let isHovered = false;
    let x;
    let y;

    const mouseOver = (event) => {
        isHovered = true;
        x = event.pageX + 5;
        y = event.pageY + 5;
    }

    const mouseMove = (event) => {
        x = event.pageX + 5;
        y = event.pageY + 5;
    }

    const mouseLeave =() => {
        isHovered = false;
    }
</script>

<div
        on:mouseover={mouseOver}
        on:mouseleave={mouseLeave}
        on:mousemove={mouseMove}>
    <slot/>
</div>

{#if isHovered}
    <div class="absolute mx-2 shadow" style="top: {y}px; left: {x}px;">
        <div class="bg-black text-gray-200 text-sm rounded py-1 px-4 right-0 bottom-full">
            {@html text}
        </div>
    </div>
{/if}
