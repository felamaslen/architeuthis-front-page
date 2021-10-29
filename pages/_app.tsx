import { Global } from '@emotion/react';
import type { AppProps } from 'next/app';

import { globalStyles } from '../styles/globals';

const Architeuthis: React.FC<AppProps> = ({ Component, pageProps }) => (
    <>
        <Global styles={globalStyles} />
        <Component {...pageProps} />
    </>
);

export default Architeuthis;
