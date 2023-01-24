<script lang="ts">
	import type { ClockConfig } from './clockConfig';
	import Digits from './Digits.svelte';
	import { atLeastFullSecond } from './util';
	import Draggable from './Draggable.svelte';

	export let config: ClockConfig;
	export let onChange = (config: ClockConfig) => {};
	export let idx: number;
	export let showAdd = true;
	export let showDelete = true;
	export let onAdd = () => {};
	export let onDelete = () => {};
	let ts: number = Date.now();
	const updateTs = () => {
		ts = Date.now();
	};

	let updateTimerId;
	let onGoing = false;
	handleChangeInterval();

	async function handleChangeInterval() {
		if (config.updateInterval <= 0) {
			clearInterval(updateTimerId);
			updateTimerId = undefined;
			return;
		}
		if (onGoing) {
			return;
		}
		onGoing = true;
		if (config.updateInterval >= 1000) {
			// Calibrate to the beginning of a second.
			await atLeastFullSecond();
		}
		clearInterval(updateTimerId);
		updateTimerId = setInterval(updateTs, config.updateInterval);
		onGoing = false;
	}

	let calibrateTimerId;
	handleChangeCalibrateInterval();

	function handleChangeCalibrateInterval() {
		clearInterval(calibrateTimerId);
		if (config.calibrateInterval <= 0) {
			calibrateTimerId = undefined;
			return;
		}
		calibrateTimerId = setInterval(handleChangeInterval, config.calibrateInterval * 1000);
	}

	function handleShowSettings() {
		config.showSettings = !config.showSettings;
		handleOnChange();
	}

	function handleOnChange() {
		config.showMilliseconds = config.showSeconds && config.showMilliseconds;
		onChange(config);
	}
</script>

<Draggable
	bind:right={config.right}
	bind:top={config.top}
	onMoved={handleOnChange}
	showShadow={config.showBg}
>
	<div class={config.showBg ? 'container blurred' : ''}>
		<div on:dblclick={handleShowSettings}>
			<Digits {...config} {ts} />
		</div>

		{#if config.showSettings}
			<p style="display: flex; margin: 8px 0 0 0;">
				<span style="font-weight: bold">Settings:</span>
				<span>&nbsp;Aniclock #{idx + 1}</span>
			</p>
			<hr />
			<form on:change={handleOnChange}>
				<p>
					<label>Style variant:</label>
					<input type="radio" bind:group={config.variant} value="m-static" />Medium (static)<br />
					<input type="radio" bind:group={config.variant} value="s-static" />Small (static)<br />
					<input type="radio" bind:group={config.variant} value="s-animated" />Small (animated)<br
					/>
				</p>

				<p>
					<label>12-hour clock:</label>
					<input type="checkbox" bind:checked={config.twelveHr} />
				</p>

				<p>
					<label>Show seconds:</label>
					<input type="checkbox" bind:checked={config.showSeconds} />
				</p>

				<p>
					<label>Show milliseconds:</label>
					<input
						type="checkbox"
						bind:checked={config.showMilliseconds}
						disabled={!config.showSeconds}
					/>
				</p>

				<p>
					<label>Show background:</label>
					<input type="checkbox" bind:checked={config.showBg} />
				</p>

				<p>
					<label>Zoom:</label>
					<input
						type="number"
						bind:value={config.zoom}
						min="0.5"
						max="4"
						step="0.5"
						style="width: 80px;"
					/>x
				</p>

				<p>
					<label>Time zone offset:</label>
					<input
						type="number"
						bind:value={config.tz}
						min="-11"
						max="11"
						style="width: 80px;"
					/>hours
				</p>

				<p>
					<label>Update interval:</label>
					<input
						type="number"
						bind:value={config.updateInterval}
						on:change={handleChangeInterval}
						min="0"
						max="60_000"
						style="width: 80px;"
					/>ms (0 = never)
				</p>

				{#if config.updateInterval >= 1000}
					<p>
						<label>Calibration interval:</label>
						<input
							type="number"
							bind:value={config.calibrateInterval}
							on:change={handleChangeCalibrateInterval}
							min="0"
							style="width: 80px;"
						/>s (0 = never)
					</p>
				{/if}
			</form>

			<hr />

			{#if config.updateInterval >= 1000}
				<button on:click={handleChangeInterval}>Calibrate</button>
			{/if}

			{#if showAdd}
				<button on:click={onAdd}>Add</button>
			{/if}

			{#if showDelete}
				<button on:click={onDelete}>Delete</button>
			{/if}

			<span class="gray-text" style="font-size: xx-small; float: right;">
				<div style="height: 0.5em" />
				Double-click the clock to close.</span
			>
		{/if}
	</div>
</Draggable>

<style>
	form {
		display: table;
		font-size: small;
	}

	p {
		display: table-row;
		margin: 4px;
	}

	label {
		display: table-cell;
	}

	input {
		display: table-cell;
		margin: 4px;
	}

	button {
		margin-right: 4px;
	}

	hr {
		border: solid 1px;
	}

	.container {
		border-radius: 8px;
		padding: 12px 16px 8px 14px;
	}

	@media (prefers-color-scheme: dark) {
		.container {
			background: #33333380;
			box-shadow: inset 0 0 0 1px #eeeeee25;
		}
		hr {
			background: #eeeeee25;
			color: #eeeeee25;
		}
		.gray-text {
			color: #ffffff66;
		}
	}

	@media (prefers-color-scheme: light) {
		.container {
			background: #e9e9e990;
		}
		hr {
			background: #11111111;
			color: #11111111;
		}
		.gray-text {
			color: #33333366;
		}
	}

	.blurred {
		backdrop-filter: blur(32px) saturate(200%);
		-webkit-backdrop-filter: blur(32px) saturate(200%);
	}
</style>
