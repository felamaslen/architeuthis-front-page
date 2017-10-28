import { h, render, Component } from 'preact';

import './sass/index.scss';

import UptimeCounter from './uptime-counter';

render(
    <UptimeCounter />,
    document.getElementById('monitor')
);

