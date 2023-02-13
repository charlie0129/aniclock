import type { ClockConfig } from './lib/clockConfig';
import { defaultClockConfig } from './lib/clockConfig';

export interface Config {
	clockConfigs: ClockConfig[];
}

export const defaultConfig: Config = {
	clockConfigs: [{ ...defaultClockConfig }]
};
