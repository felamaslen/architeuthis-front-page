import formatDate from 'date-fns/format';
import isValidDate from 'date-fns/isValid';
import { useEffect, useMemo, useState } from 'react';

import { initialUPS, UPS } from '../shared/ups';
import { NavDropdown } from './NavDropdown';

type UPSHook = { ups: UPS; fetching: boolean };

function formatPossiblyInvalidDate(
    dateString: string | null,
    formatString: string,
    defaultValue = '<unknown>',
): string {
    const date = new Date(dateString ?? '');
    return isValidDate(date) ? formatDate(date, formatString) : defaultValue;
}

export function useUPS(): { ups: UPS; fetching: boolean } {
    const [ups, setUPS] = useState<UPS>(initialUPS);
    const [fetching, setFetching] = useState<boolean>(true);
    useEffect(() => {
        const controller = new AbortController();
        const makeRequest = async (): Promise<void> => {
            setFetching(true);
            const res = await fetch('/api/ups', {
                signal: controller.signal,
                headers: {
                    accept: 'application/json',
                },
            });
            const json = await res.json();
            if (!controller.signal.aborted) {
                setUPS(json);
                setFetching(false);
            }
        };
        makeRequest();

        return (): void => {
            controller.abort();
        };
    }, []);

    return useMemo<UPSHook>(() => ({ ups, fetching }), [ups, fetching]);
}

export const NavBoxUPS: React.FC = () => {
    const { ups, fetching } = useUPS();
    return (
        <div>
            <h3>UPS</h3>
            {!fetching && (
                <NavDropdown>
                    <li>Date: {formatPossiblyInvalidDate(ups.date, 'HH:mm yyyy-MM-dd')}</li>
                    <li>Model: {ups.model ?? '<unknown>'}</li>
                    <li>Load: {ups.load ?? '<unknown>'}</li>
                    <li>Charge: {ups.charge ?? '<unknown>'}</li>
                    <li>
                        Backup time:{' '}
                        {ups.backupTimeSeconds === null
                            ? '<unknown>'
                            : `${Math.round(ups.backupTimeSeconds / 60)} min`}
                    </li>
                    <li>Transfers: {ups.transfers ?? '<unknown>'}</li>
                    <li>
                        Last power failure:{' '}
                        {formatPossiblyInvalidDate(
                            ups.lastPowerFailure,
                            'EEEE, MMMM dd yyyy HH:MM:ss',
                            'N/A',
                        )}
                    </li>
                    <li>
                        Time on battery:{' '}
                        {ups.timeOnBatterySeconds === null
                            ? '<unknown>'
                            : `${Math.round(ups.timeOnBatterySeconds / 6) / 10} min`}
                    </li>
                </NavDropdown>
            )}
        </div>
    );
};
