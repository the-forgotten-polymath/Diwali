import { DiwaliEngine } from '../core/DiwaliEngine';
import { BaseEffectOptions, DiyasOptions, RocketsOptions, ChakriOptions, AnarOptions, PhuljhadiOptions, LanternsOptions, FlowerShowerOptions, FestiveComboOptions, InteractiveClickOptions } from '../core/types';
export declare function useDiwali(options?: BaseEffectOptions): {
    engine: DiwaliEngine | null;
    diyas: (opt?: DiyasOptions) => (() => void) | undefined;
    rockets: (opt?: RocketsOptions) => (() => void) | undefined;
    chakri: (opt?: ChakriOptions) => (() => void) | undefined;
    anar: (opt?: AnarOptions) => (() => void) | undefined;
    phuljhadi: (opt?: PhuljhadiOptions) => (() => void) | undefined;
    lanterns: (opt?: LanternsOptions) => (() => void) | undefined;
    flowerShower: (opt?: FlowerShowerOptions) => (() => void) | undefined;
    celebrate: (opt?: FestiveComboOptions) => (() => void) | undefined;
    enableMouseSparkler: (opt?: PhuljhadiOptions) => (() => void) | undefined;
    enableClickToSpawn: (mode?: InteractiveClickOptions["effect"]) => (() => void) | undefined;
    clear: () => void;
    soundEnabled: boolean;
    toggleSound: () => void;
};
