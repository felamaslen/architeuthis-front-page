export type UPS = {
    date: string | null;
    model: string | null;
    load: string | null;
    charge: string | null;
    backupTimeSeconds: number | null;
    transfers: number | null;
    lastPowerFailure: string | null;
    timeOnBatterySeconds: number | null;
};
