import os from 'os';

export function getSystemUptime(): number {
    return Math.round(os.uptime());
}
