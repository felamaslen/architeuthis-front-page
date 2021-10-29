import '@babel/polyfill';

import React from 'react';
import { render } from 'react-dom';

import './sass/index.scss';

import UptimeCounter from './uptime-counter';

import Nav from './nav';

import './sass/index.scss';

render(<UptimeCounter />, document.getElementById('monitor'));

render(<Nav />, document.getElementById('nav-main'));

