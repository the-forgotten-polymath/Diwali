import React from 'react';
import { DiyasOptions } from '../core/types';
export interface DiyaDockProps extends DiyasOptions {
    className?: string;
    style?: React.CSSProperties;
}
export declare const DiyaDock: React.FC<DiyaDockProps>;
