export interface ClockConfig {
	showSeconds: boolean;
	showMilliseconds: boolean;
	twelveHr: boolean;
	variant: 'm-static' | 's-animated' | 's-static';
	showBg: boolean;
	blur: number;
	bgColor: string;
	tz: number;
	updateInterval: number;
	calibrateInterval: number;
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
	calibrateInterval: 600, // 600s
	right: 0,
	top: 0,
	showSettings: true,
	blur: 32,
	bgColor: '#E0E0E099',
	showBg: true,
	zoom: 1
};
