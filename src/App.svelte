<script lang="ts">
	import Clock from './lib/Clock.svelte';
	import type { Config } from './config';
	import { defaultConfig } from './config';
	import { defaultClockConfig } from './lib/clockConfig';

	let config: Config;
	const vw: number = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
	const vh: number = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
	const cols: number = Math.floor(vw / 500);
	const rows: number = Math.floor(vh / 300);

	config = JSON.parse(localStorage.getItem('aniclock-config') || 'null') || defaultConfig;
	if (moveOutOfBoundaryClocks()) {
		handleConfigChange();
	}

	// Just some very basic initial location.
	function handleAddClock() {
		const idx = config.clockConfigs.length;
		config.clockConfigs.push({
			...defaultClockConfig,
			right: 500 * (idx % cols),
			top: 300 * Math.floor(idx / cols)
		});
		config = config;
		handleConfigChange();
	}

	function handleDeleteClock(id: number) {
		config.clockConfigs.splice(id, 1);
		config = config;
		handleConfigChange();
	}

	function handleConfigChange() {
		moveOutOfBoundaryClocks();
		localStorage.setItem('aniclock-config', JSON.stringify(config));
	}

	function moveOutOfBoundaryClocks(): boolean {
		let moved = false;
		config.clockConfigs.forEach((i, idx) => {
			if (i.right < 0 || i.right > vw || i.top < 0 || i.top > vh) {
				moved = true;
				const col = idx % cols;
				const row = Math.floor(idx / cols);
				i.right = 500 * col;
				i.top = 300 * row;
			}
		});
		config = config;
		return moved;
	}
</script>

<main>
	{#each config.clockConfigs as conf, i}
		<Clock
			idx={i}
			config={conf}
			onAdd={handleAddClock}
			onDelete={() => {
				handleDeleteClock(i);
			}}
			onChange={handleConfigChange}
			showDelete={config.clockConfigs.length > 1}
			showAdd={config.clockConfigs.length < rows * cols - 1}
		/>
	{/each}
</main>

<style>
</style>
