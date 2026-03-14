import { Env } from '../config/env.js';
export const isKillSwitchActive = (env: Env): boolean => env.KILL_SWITCH;
