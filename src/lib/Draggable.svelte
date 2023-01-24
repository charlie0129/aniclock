<script lang="ts">
	export let right = 100;
	export let top = 100;
	export let onMoved = (a, b) => {};
	export let showShadow = true;

	let oldRight = right;
	let oldTop = top;
	let width: number;
	let moving = false;

	const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

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

<section
	bind:offsetWidth={width}
	class={(showShadow ? 'shadow' : '') + ' draggable'}
	on:mousedown={onMouseDown}
	style="right: {right}px; top: {top}px; --border-width: {1 / devicePixelRatio}px;"
>
	<slot />
</section>

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp} />

<style>
	.draggable {
		user-select: none;
		cursor: move;
		position: absolute;
	}

	.shadow {
		border-radius: 8px;
	}

	@media (prefers-color-scheme: dark) {
		.shadow {
			/*I have to place shadows here instead in Clock because WebKit have a problem handling box-shdow and backdrop-filter.*/
			box-shadow: 2px 4px 16px 2px rgba(0, 0, 0, 0.2), 0 0 0 var(--border-width) #000000cc;
		}
	}

	@media (prefers-color-scheme: light) {
		.shadow {
			/*I have to place shadows here instead in Clock because WebKit have a problem handling box-shdow and backdrop-filter.*/
			box-shadow: 2px 4px 16px 2px rgba(0, 0, 0, 0.2), 0 0 0 var(--border-width) rgba(0, 0, 0, 0.2);
		}
	}
</style>
