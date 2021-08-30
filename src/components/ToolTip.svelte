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
    <div style="top: {y}px; left: {x}px;" class="tooltip">{@html text}</div>
{/if}

<style>
    .tooltip {
        border: 1px solid #ddd;
        box-shadow: 1px 1px 1px #ddd;
        background: white;
        border-radius: 4px;
        padding: 4px;
        position: absolute;
    }
</style>