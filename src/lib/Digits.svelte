<script lang="ts">
    export let ts: number = 1674474798111;
    export let tz: number = 0;
    export let twelveHr: boolean = true;
    export let showSeconds: boolean = true;
    export let showMilliseconds: boolean = false;
    export let variant: "m-static" | "s-animated" | "s-static" = "s-animated";

    let h0: string = "0",
        h1: string = "9",
        m0: string = "4",
        m1: string = "1",
        s0: string = "0",
        s1: string = "0",
        ms0: string = "0",
        ms1: string = "0",
        ms2: string = "0";

    $: {
        const date = new Date(ts + tz * 3600 * 1000);
        const dateDigits = date.toISOString(). // '2023-01-23T04:08:03.335Z'
            substring(11, 23). // '04:08:03.335'
            replaceAll(":", ""). // '040803.335'
            replace(".", ""). // '040803335'
            split(""); // ['0', '4', '0', '8', '0', '3', '3', '3', '5']

        // handle 12-hr clock
        if (twelveHr) {
            let hr = date.getUTCHours();
            if (hr > 12) {
                hr -= 12;
                const hrStr = hr.toFixed(0).split("");
                if (hr >= 10) {
                    dateDigits[0] = hrStr[0];
                    dateDigits[1] = hrStr[1];
                } else {
                    dateDigits[0] = "0";
                    dateDigits[1] = hrStr[0];
                }
            }
        }

        [h0, h1, m0, m1, s0, s1, ms0, ms1, ms2] = dateDigits;
    }
</script>

<style>
    .digits {
        display: inline-block;
        white-space: nowrap;
        /* preserve original pixelated look  */
        image-rendering: pixelated;
    }
</style>

<div class="digits" on:mousedown|preventDefault={()=>{}}>
    <span title="Hour">
        {#if h0 !== "0"}
            <img src="{variant}/{h0}.gif" alt="hh-digit-0"/>
        {/if}
        <img alt="hh-digit-1" src="{variant}/{h1}.gif"/>
    </span>


    <img alt="mm-hh-colon" src="{variant}/colon.gif"/>
    <span title="Minute">
            <img alt="mm-digit-0" src="{variant}/{m0}.gif"/>
            <img alt="mm-digit-1" src="{variant}/{m1}.gif"/>
    </span>

    {#if showSeconds}
        <img src="{variant}/colon.gif" alt="ss-mm-colon"/>
        <span title="Second">
            <img src="{variant}/{s0}.gif" alt="ss-digit-0"/>
            <img src="{variant}/{s1}.gif" alt="ss-digit-1"/>
        </span>
    {/if}

    {#if showMilliseconds}
        <img src="{variant}/dot.gif" alt="ss-ms-colon"/>
        <span title="Millisecond">
            <img src="{variant}/{ms0}.gif" alt="ms-digit-0"/>
            <img src="{variant}/{ms1}.gif" alt="ms-digit-1"/>
            <img src="{variant}/{ms2}.gif" alt="ms-digit-2"/>
        </span>
    {/if}
</div>

