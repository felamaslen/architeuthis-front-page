import { h, render, Component } from 'preact';

import './sass/index.scss';

import UptimeCounter from './uptime-counter';

import Nav from './nav';

render(<UptimeCounter />, document.getElementById('monitor'));

render(<Nav />, document.getElementById('nav-main'));

