import { NextApiRequest, NextApiResponse } from 'next';
import { getSystemUptime } from '../../shared/uptime';

export default async function handler(
    _: NextApiRequest,
    res: NextApiResponse<{ uptime: number }>,
): Promise<void> {
    const uptime = getSystemUptime();
    res.status(200).json({ uptime });
}
