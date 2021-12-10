import cpu1x from './cpu.png';
import cpu2x from './cpu@2x.png';
import ram1x from './ram.png';
import ram2x from './ram@2x.png';
import hdd1x from './hdd.png';
import hdd2x from './hdd@2x.png';
import ssd1x from './ssd.png';
import ssd2x from './ssd@2x.png';
import psu1x from './psu.png';
import psu2x from './psu@2x.png';
import case1x from './case.png';
import case2x from './case@2x.png';
import motherboard1x from './motherboard.png';
import motherboard2x from './motherboard@2x.png';

import { Specs } from '../NavBoxSpecs.types';

export const specImages: Record<Specs, { x1: string; x2: string }> = {
    [Specs.CPU]: {
        x1: cpu1x.src,
        x2: cpu2x.src,
    },
    [Specs.RAM]: {
        x1: ram1x.src,
        x2: ram2x.src,
    },
    [Specs.HDD]: {
        x1: hdd1x.src,
        x2: hdd2x.src,
    },
    [Specs.SSD]: {
        x1: ssd1x.src,
        x2: ssd2x.src,
    },
    [Specs.PSU]: {
        x1: psu1x.src,
        x2: psu2x.src,
    },
    [Specs.Case]: {
        x1: case1x.src,
        x2: case2x.src,
    },
    [Specs.Motherboard]: {
        x1: motherboard1x.src,
        x2: motherboard2x.src,
    },
};
