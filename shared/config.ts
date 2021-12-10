import getenv from 'getenv';

export const config = {
    upsCommand: getenv.string('UPS_COMMAND', 'apcaccess'),
    upsCommandTimeoutMs: getenv.int('UPS_COMMAND_TIMEOUT', 5000),
    powerUsage: getenv.float('POWER_USAGE', 0),
    costKwh: getenv.float('COST_KWH', 0),
    upsCapacity: getenv.int('UPS_CAPACITY', 0),
    installTime: getenv.int('INSTALLATION_TIME', 0),
    apcaccessCacheMaxAge: 300000,
    tempsCacheMaxAge: 2000,
};
