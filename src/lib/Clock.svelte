<script lang="ts">
    import type {ClockConfig} from "./clockConfig";
    import Digits from "./Digits.svelte";
    import {atLeastFullSecond} from "./util";
    import Draggable from "./Draggable.svelte";

    export let config: ClockConfig;
    export let onChange = (config: ClockConfig) => {
    };
    export let idx: number;
    export let showAdd = true;
    export let showDelete = true;
    export let onAdd = () => {
    };
    export let onDelete = () => {
    };
    let ts: number = Date.now();
    const updateTs = () => {
        ts = Date.now();
    }

    let updateTimerId;
    let onGoing = false;
    handleChangeInterval()

    async function handleChangeInterval() {
        if (config.updateInterval <= 0) {
            clearInterval(updateTimerId)
            updateTimerId = undefined;
            return;
        }
        if (onGoing) {
            return
        }
        onGoing = true
        if (config.updateInterval >= 1000) {
            // Calibrate to the beginning of a second.
            await atLeastFullSecond()
        }
        clearInterval(updateTimerId)
        updateTimerId = setInterval(updateTs, config.updateInterval)
        onGoing = false
    }

    let calibrateTimerId;
    handleChangeCalibrateInterval()
    function handleChangeCalibrateInterval() {
        clearInterval(calibrateTimerId)
        if (config.calibrateInterval <= 0) {
            calibrateTimerId = undefined;
            return;
        }
        calibrateTimerId = setInterval(handleChangeInterval, config.calibrateInterval*1000)
    }

    function handleOnChange() {
        onChange(config)
    }
</script>

<style>
    form {
        display: table;
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
        margin: 2px;
    }

    button {
        margin-right: 4px;
    }
</style>

<Draggable bind:left={config.left} bind:top={config.top} onMoved={handleOnChange}>
    <Digits {ts} {...config}/>

    {#if config.showSettings}
        <div style="padding: 8px; background: #FFFFFF66">
            <p style="display: flex">
                <span style="font-weight: bold">Settings:</span>
                <span>&nbsp;Aniclock #{idx + 1}</span>
            </p>
            <hr>
            <form on:change={handleOnChange}>
                <p>
                    <label>Style variant:</label>
                    <input type="radio" bind:group={config.variant} value="m-static">Medium (static)<br>
                    <input type="radio" bind:group={config.variant} value="s-static">Small (static)<br>
                    <input type="radio" bind:group={config.variant} value="s-animated">Small (animated)<br>
                </p>

                <p>
                    <label>12-hour clock:</label>
                    <input type="checkbox" bind:checked={config.twelveHr}>
                </p>

                <p>
                    <label>Show seconds:</label>
                    <input type="checkbox" bind:checked={config.showSeconds}>
                </p>

                <p>
                    <label>Show milliseconds:</label>
                    <input type="checkbox" bind:checked={config.showMilliseconds} disabled={!config.showSeconds}>
                </p>

                <p>
                    <label>Time zone offset:</label>
                    <input type="number" bind:value={config.tz} min=-11 max=11 style="width: 56px;">hours
                </p>

                <p>
                    <label>Update interval:</label>
                    <input type="number" bind:value={config.updateInterval} on:change={handleChangeInterval}
                           min=0 max=60_000 style="width: 56px;">ms (0 = never)
                </p>

                <p>
                    <label>Calibrate interval:</label>
                    <input type="number" bind:value={config.calibrateInterval} on:change={handleChangeCalibrateInterval}
                           min=0 style="width: 56px;">s (0 = never)
                </p>
            </form>

            <hr>

            <button on:click={handleChangeInterval}>Calibrate</button>

            {#if showAdd}
                <button on:click={onAdd}>Add</button>
            {/if}

            {#if showDelete}
                <button on:click={onDelete}>Delete</button>
            {/if}

            <span style="font-size: xx-small; color: gray; float: right;">Double-click anywhere to close.</span>
        </div>
    {/if}
</Draggable>


