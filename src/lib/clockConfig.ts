export interface ClockConfig {
	showSeconds: boolean;
	showMilliseconds: boolean;
	twelveHr: boolean;
	variant: 'm-static' | 's-animated' | 's-static';
	showBg: boolean;
	tz: number;
	updateInterval: number;
	right: number;
	top: number;
	showSettings: boolean;
	zoom: number;
}

export const defaultClockConfig: ClockConfig = {
	showSeconds: true,
	showMilliseconds: false,
	twelveHr: true,
	variant: 's-animated',
	tz: -new Date().getTimezoneOffset() / 60,
	updateInterval: 1_000, // 1s
	right: 0,
	top: 0,
	showSettings: true,
	showBg: true,
	zoom: 1
};
