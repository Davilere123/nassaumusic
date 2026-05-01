import { useEffect, useRef, useState } from 'react';
import { useAudio } from '../context/AudioContext';

// ─────────────────────────────────────────────
//  useAudioProgress
//
//  Hook auxiliar que interpola a posição do áudio
//  a 60fps localmente, evitando depender só dos
//  callbacks do expo-av (que chegam a cada ~100ms).
//
//  Uso:
//    const { smoothPosition, progress } = useAudioProgress();
// ─────────────────────────────────────────────

export function useAudioProgress() {
  const { positionMs, durationMs, isPlaying } = useAudio();

  // Guarda o timestamp em que recebemos a última posição do expo-av
  const lastUpdateRef = useRef({ positionMs, timestamp: Date.now() });
  const rafRef = useRef(null);

  const [smoothPosition, setSmoothPosition] = useState(positionMs);

  // Atualiza a referência sempre que o expo-av nos envia uma posição nova
  useEffect(() => {
    lastUpdateRef.current = { positionMs, timestamp: Date.now() };
    setSmoothPosition(positionMs);
  }, [positionMs]);

  // Loop de animação apenas quando tocando
  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = () => {
      const elapsed = Date.now() - lastUpdateRef.current.timestamp;
      const estimated = lastUpdateRef.current.positionMs + elapsed;
      // Não ultrapassar a duração total
      setSmoothPosition((prev) =>
        durationMs > 0 ? Math.min(estimated, durationMs) : prev,
      );
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, durationMs]);

  const progress = durationMs > 0 ? smoothPosition / durationMs : 0;

  return { smoothPosition, progress };
}