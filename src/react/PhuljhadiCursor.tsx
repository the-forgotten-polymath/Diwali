import React, { useEffect } from 'react';
import { DiwaliEngine } from '../core/DiwaliEngine';
import { PhuljhadiOptions } from '../core/types';

export const PhuljhadiCursor: React.FC<PhuljhadiOptions> = (props) => {
  useEffect(() => {
    const engine = new DiwaliEngine({
      zIndex: props.zIndex ?? 99999,
      sound: props.sound ?? false,
    });

    const stop = engine.enableMouseSparkler(props);

    return () => {
      stop();
      engine.destroy();
    };
  }, [props.sound, props.scale]);

  return null;
};

