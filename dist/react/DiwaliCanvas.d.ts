import React from 'react';
import { BaseEffectOptions, DiyasOptions, RocketsOptions, LanternsOptions, FlowerShowerOptions, FestiveComboOptions } from '../core/types';
export interface DiwaliCanvasProps extends BaseEffectOptions {
    className?: string;
    style?: React.CSSProperties;
    autoCelebrate?: boolean;
    diyasOptions?: DiyasOptions;
    rocketsOptions?: RocketsOptions;
    lanternsOptions?: LanternsOptions;
    flowerShowerOptions?: FlowerShowerOptions;
    celebrateOptions?: FestiveComboOptions;
    mouseSparkler?: boolean;
    clickToSpawn?: 'rocket' | 'chakri' | 'anar' | 'phuljhadi' | 'random' | 'none';
}
export declare const DiwaliCanvas: React.FC<DiwaliCanvasProps>;
