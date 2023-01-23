import type {ClockConfig} from "./lib/clockConfig";
import {defaultClockConfig} from "./lib/clockConfig";

export interface Config {
    clockConfigs: ClockConfig[];
    reloadInterval: number;
}

export const defaultConfig: Config = {
    clockConfigs: [{...defaultClockConfig}],
    reloadInterval: 3600_000, // 1h
}