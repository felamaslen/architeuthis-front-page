export type UPS = {
    date: Date | null;
    model: string | null;
    load: string | null;
    charge: string | null;
    backupTimeSeconds: number | null;
    transfers: number | null;
    lastPowerFailure: Date | null;
    timeOnBatterySeconds: number | null;
};
