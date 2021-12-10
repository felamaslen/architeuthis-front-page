import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    _: NextApiRequest,
    res: NextApiResponse<{ ok: boolean }>,
): Promise<void> {
    res.status(200).json({ ok: true });
}
