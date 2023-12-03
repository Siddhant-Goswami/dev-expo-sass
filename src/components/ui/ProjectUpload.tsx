'use client';

import { useCallback, useRef } from 'react';
import ReactCanvasConfetti, { type IProps } from 'react-canvas-confetti';
import { ProjectUploadForm } from './project-upload-form';

export function ProjectUpload() {
  const refAnimationInstance = useRef<IProps | null>(null);

  /**
   * * Animations stuff */
  const getAnimationInstance = useCallback(
    // @ts-expect-error bad types
    (instance: Parameters<IProps['refConfetti']>[0]) => {
      refAnimationInstance.current = instance;
    },
    [],
  );

  const makeShot = useCallback((particleRatio: number, opts: IProps) => {
    if (!refAnimationInstance.current) {
      return;
    }

    // @ts-expect-error bad types
    refAnimationInstance?.current?.({
      ...opts,
      origin: { y: 0.7 },
      particleCount: Math.floor(200 * particleRatio),
    });
  }, []);

  const fireConfettiAnimation = useCallback(() => {
    console.log('Firing confetti animation');
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  return (
    <>
      <ReactCanvasConfetti
        refConfetti={getAnimationInstance}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
        }}
      />
      <ProjectUploadForm
        onProjectUploadSuccess={() => {
          fireConfettiAnimation();
        }}
      />
    </>
  );
}
