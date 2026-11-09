import React, { useEffect, useRef } from 'react';
import { DiwaliEngine } from '../core/DiwaliEngine';
import {
  BaseEffectOptions,
  DiyasOptions,
  RocketsOptions,
  LanternsOptions,
  FlowerShowerOptions,
  FestiveComboOptions,
} from '../core/types';

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

export const DiwaliCanvas: React.FC<DiwaliCanvasProps> = ({
  className,
  style,
  autoCelebrate,
  diyasOptions,
  rocketsOptions,
  lanternsOptions,
  flowerShowerOptions,
  celebrateOptions,
  mouseSparkler,
  clickToSpawn,
  ...baseOptions
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<DiwaliEngine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new DiwaliEngine({
      ...baseOptions,
      canvas: canvasRef.current,
    });
    engineRef.current = engine;

    if (autoCelebrate) {
      engine.celebrate(celebrateOptions);
    } else {
      if (diyasOptions) engine.diyas(diyasOptions);
      if (lanternsOptions) engine.lanterns(lanternsOptions);
      if (flowerShowerOptions) engine.flowerShower(flowerShowerOptions);
    }

    if (mouseSparkler) {
      engine.enableMouseSparkler();
    }

    if (clickToSpawn && clickToSpawn !== 'none') {
      engine.enableClickToSpawn(clickToSpawn);
    }

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        ...style,
      }}
      aria-hidden="true"
      role="presentation"
    />
  );
};
