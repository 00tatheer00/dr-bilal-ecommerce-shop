'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CelebrationConfettiProps {
  durationMs?: number;
}

export default function CelebrationConfetti({ durationMs = 3000 }: CelebrationConfettiProps) {
  useEffect(() => {
    const end = Date.now() + durationMs;
    const colors = ['#F6D365', '#B81D4E', '#D4AF37', '#114226', '#FAF9F6'];

    (function frame() {
      try {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
      } catch {
        // ignore in non-browser env
      }

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, [durationMs]);

  return null;
}

