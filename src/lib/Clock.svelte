<script lang="ts">
	import type { ClockConfig } from './clockConfig';
	import Digits from './Digits.svelte';
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

	let updateTimerId: NodeJS.Timer;
	handleChangeInterval();

	async function handleChangeInterval() {
		if (config.updateInterval <= 0) {
			clearInterval(updateTimerId);
			return;
		}
		clearInterval(updateTimerId);
		// When not showing milliseconds, always use 100ms interval
		updateTimerId = setInterval(updateTs, config.showMilliseconds ? config.updateInterval : 100);
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
						on:change={() => {
							handleChangeInterval();
						}}
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
						min="0.25"
						max="8"
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

				{#if config.showMilliseconds}
					<p>
						<label>Update interval:</label>
						<input
							type="number"
							bind:value={config.updateInterval}
							on:change={handleChangeInterval}
							min="1"
							max="1_000"
							style="width: 80px;"
						/>ms
					</p>
				{/if}
			</form>

			<hr />

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
