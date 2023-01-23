<script lang="ts">
    export let right = 100;
    export let top = 100;
    export let onMoved = (a, b) => {
    };

    let oldRight = right;
    let oldTop = top;
    let width: number;
    let moving = false;

    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)

    function calcRight(left: number) {
        return vw - left - width;
    }

    function onMouseDown() {
        moving = true;
        oldRight = right;
        oldTop = top;
    }

    function onMouseMove(e) {
        if (moving) {
            right -= e.movementX;
            top += e.movementY;
        }
    }

    function onMouseUp() {
        moving = false;
        if (oldRight !== right && oldTop !== top) {
            onMoved(right, top);
        }
        oldRight = right;
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

<section
        bind:offsetWidth={width}
        class="draggable"
        on:mousedown={onMouseDown}
        style="right: {right}px; top: {top}px;"
>
    <slot></slot>
</section>

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp}/>
