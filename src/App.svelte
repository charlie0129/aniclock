<script lang="ts">
    import Clock from "./lib/Clock.svelte";
    import type {Config} from "./config";
    import {defaultConfig} from "./config";
    import {defaultClockConfig} from "./lib/clockConfig";

    let config: Config;
    const vw: number = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh: number = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const cols: number = Math.floor(vw / 500);
    const rows: number = Math.floor(vh / 300);


    config = JSON.parse(localStorage.getItem("config")) || defaultConfig;
    if (moveOutOfBoundaryClocks()) {
        handleConfigChange()
    }

    function handleAddClock() {
        const idx = config.clockConfigs.length;
        config.clockConfigs.push({
            ...defaultClockConfig,
            left: 500 * (idx % cols),
            top: 300 * Math.floor(idx / cols),
        });
        config = config;
        handleConfigChange();
    }

    function handleDeleteClock(id: number) {
        config.clockConfigs.splice(id, 1)
        config = config;
        handleConfigChange();
    }

    function handleConfigChange() {
        moveOutOfBoundaryClocks()
        localStorage.setItem("config", JSON.stringify(config))
        console.log("stored config", config)
    }

    function moveOutOfBoundaryClocks(): boolean {
        let moved = false;
        config.clockConfigs.forEach((i, idx) => {
            if (i.left < 0 || i.left > vw || i.top < 0 || i.top > vh) {
                moved = true;
                const col = idx % cols;
                const row = Math.floor(idx / cols);
                i.left = 500 * col;
                i.top = 300 * row;
            }
        })
        config = config
        return moved
    }

    function handleShowSettings(idx: number) {
        const i = config.clockConfigs[idx];
        i.showSettings = !i.showSettings;
        config = config;
        handleConfigChange();
    }
</script>

<main>
    {#each config.clockConfigs as conf, i}
        <div on:dblclick={()=>{handleShowSettings(i)}}>
            <Clock idx={i}
                   config={conf}
                   onAdd={handleAddClock}
                   onDelete={()=>{handleDeleteClock(i)}}
                   onChange={handleConfigChange}
                   showDelete={config.clockConfigs.length>1}
                   showAdd={config.clockConfigs.length<rows*cols-1}
            />
        </div>
    {/each}
</main>

<style>

</style>