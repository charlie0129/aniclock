<script lang="ts">
	export let ts = 1674474798111;
	export let tz = 0;
	export let twelveHr = true;
	export let showSeconds = true;
	export let showMilliseconds = false;
	export let variant: 'm-static' | 's-animated' | 's-static' = 's-animated';
	export let zoom = 1;

	const heights = {
		'm-static': 150,
		's-animated': 100,
		's-static': 100
	};

	let h0 = '0',
		h1 = '9',
		m0 = '4',
		m1 = '1',
		s0 = '0',
		s1 = '0',
		ms0 = '0',
		ms1 = '0',
		ms2 = '0';

	$: {
		const date = new Date(ts + tz * 3600 * 1000);
		const dateDigits = date
			.toISOString() // '2023-01-23T04:08:03.335Z'
			.substring(11, 23) // '04:08:03.335'
			.replaceAll(':', '') // '040803.335'
			.replace('.', '') // '040803335'
			.split(''); // ['0', '4', '0', '8', '0', '3', '3', '3', '5']

		// handle 12-hr clock
		if (twelveHr) {
			let hr = date.getUTCHours();
			if (hr > 12) {
				hr -= 12;
				const hrStr = hr.toFixed(0).split('');
				if (hr >= 10) {
					dateDigits[0] = hrStr[0];
					dateDigits[1] = hrStr[1];
				} else {
					dateDigits[0] = '0';
					dateDigits[1] = hrStr[0];
				}
			}
		}

		[h0, h1, m0, m1, s0, s1, ms0, ms1, ms2] = dateDigits;
	}
</script>

<div
	class="digits"
	on:mousedown|preventDefault={() => {}}
	style="--height: {heights[variant] * zoom}px"
>
	<span title="Hour">
		{#if h0 !== '0'}
			<img src="{variant}/{h0}.gif" alt="hh-digit-0" />
		{/if}
		<img alt="hh-digit-1" src="{variant}/{h1}.gif" />
	</span>

	<img alt="mm-hh-colon" src="{variant}/colon.gif" />
	<span title="Minute">
		<img alt="mm-digit-0" src="{variant}/{m0}.gif" />
		<img alt="mm-digit-1" src="{variant}/{m1}.gif" />
	</span>

	{#if showSeconds}
		<img src="{variant}/colon.gif" alt="ss-mm-colon" />
		<span title="Second">
			<img src="{variant}/{s0}.gif" alt="ss-digit-0" />
			<img src="{variant}/{s1}.gif" alt="ss-digit-1" />
		</span>
	{/if}

	{#if showMilliseconds}
		<img src="{variant}/dot.gif" alt="ss-ms-colon" />
		<span title="Millisecond">
			<img src="{variant}/{ms0}.gif" alt="ms-digit-0" />
			<img src="{variant}/{ms1}.gif" alt="ms-digit-1" />
			<img src="{variant}/{ms2}.gif" alt="ms-digit-2" />
		</span>
	{/if}
</div>

<style>
	.digits {
		display: inline-block;
		white-space: nowrap;
		/* preserve original pixelated look  */
		image-rendering: pixelated;
	}

	img {
		height: var(--height);
	}
</style>
