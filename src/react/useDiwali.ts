import { useEffect, useRef, useState, useCallback } from 'react';
import { DiwaliEngine } from '../core/DiwaliEngine';
import {
  BaseEffectOptions,
  DiyasOptions,
  RocketsOptions,
  ChakriOptions,
  AnarOptions,
  PhuljhadiOptions,
  LanternsOptions,
  FlowerShowerOptions,
  FestiveComboOptions,
  InteractiveClickOptions,
} from '../core/types';

export function useDiwali(options?: BaseEffectOptions) {
  const engineRef = useRef<DiwaliEngine | null>(null);
  const [soundEnabled, setSoundEnabledState] = useState(options?.sound ?? false);

  useEffect(() => {
    engineRef.current = new DiwaliEngine(options);

    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  const diyas = useCallback((opt?: DiyasOptions) => {
    return engineRef.current?.diyas(opt);
  }, []);

  const rockets = useCallback((opt?: RocketsOptions) => {
    return engineRef.current?.rockets(opt);
  }, []);

  const chakri = useCallback((opt?: ChakriOptions) => {
    return engineRef.current?.chakri(opt);
  }, []);

  const anar = useCallback((opt?: AnarOptions) => {
    return engineRef.current?.anar(opt);
  }, []);

  const phuljhadi = useCallback((opt?: PhuljhadiOptions) => {
    return engineRef.current?.phuljhadi(opt);
  }, []);

  const lanterns = useCallback((opt?: LanternsOptions) => {
    return engineRef.current?.lanterns(opt);
  }, []);

  const flowerShower = useCallback((opt?: FlowerShowerOptions) => {
    return engineRef.current?.flowerShower(opt);
  }, []);

  const celebrate = useCallback((opt?: FestiveComboOptions) => {
    return engineRef.current?.celebrate(opt);
  }, []);

  const enableMouseSparkler = useCallback((opt?: PhuljhadiOptions) => {
    return engineRef.current?.enableMouseSparkler(opt);
  }, []);

  const enableClickToSpawn = useCallback((mode: InteractiveClickOptions['effect'] = 'random') => {
    return engineRef.current?.enableClickToSpawn(mode);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      engineRef.current?.setSoundEnabled(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    engineRef.current?.clear();
  }, []);

  return {
    engine: engineRef.current,
    diyas,
    rockets,
    chakri,
    anar,
    phuljhadi,
    lanterns,
    flowerShower,
    celebrate,
    enableMouseSparkler,
    enableClickToSpawn,
    clear,
    soundEnabled,
    toggleSound,
  };
}

