import React, { useEffect, useRef } from 'react';
import { DiwaliEngine } from '../core/DiwaliEngine';
import { DiyasOptions } from '../core/types';

export interface DiyaDockProps extends DiyasOptions {
  className?: string;
  style?: React.CSSProperties;
}

export const DiyaDock: React.FC<DiyaDockProps> = ({
  className,
  style,
  count = 7,
  scale = 1,
  glowIntensity = 1,
  smoke = true,
  ...baseOptions
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new DiwaliEngine({
      ...baseOptions,
      container: containerRef.current,
      zIndex: 10,
    });

    engine.diyas({
      count,
      scale,
      glowIntensity,
      smoke,
      mode: 'docked',
    });

    return () => {
      engine.destroy();
    };
  }, [count, scale, glowIntensity, smoke]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '90px',
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
};

