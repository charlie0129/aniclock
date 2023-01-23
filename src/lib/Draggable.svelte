<script>
    export let left = 100;
    export let top = 100;
    export let onMoved = (a, b) => {
    };

    let oldLeft = left;
    let oldTop = top;
    let moving = false;

    function onMouseDown() {
        moving = true;
        oldLeft = left;
        oldTop = top;
    }

    function onMouseMove(e) {
        if (moving) {
            left += e.movementX;
            top += e.movementY;
        }
    }

    function onMouseUp() {
        moving = false;
        if (oldLeft !== left && oldTop !== top) {
            onMoved(left, top);
        }
        oldLeft = left;
        oldTop = top;
    }
</script>

<style>
    .draggable {
        user-select: none;
        cursor: move;
        position: absolute;
    }
</style>

<section class="draggable" on:mousedown={onMouseDown} style="left: {left}px; top: {top}px;">
    <slot></slot>
</section>

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp}/>
