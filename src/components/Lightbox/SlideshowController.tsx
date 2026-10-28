import { useEffect, useRef } from 'react';

interface SlideshowControllerProps {
  isActive: boolean;
  intervalMs?: number;
  onNext: () => void;
  onPause: () => void;
}

export function SlideshowController({
  isActive,
  intervalMs = 3000,
  onNext,
  onPause,
}: SlideshowControllerProps) {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      onNext();
    }, intervalMs);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        onPause();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, intervalMs, onNext, onPause]);

  return null;
}
