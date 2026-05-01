import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

// ─────────────────────────────────────────────
//  AudioContext — estado global do player
//  Usa expo-audio (substituto do expo-av no SDK 53+)
// ─────────────────────────────────────────────

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const currentTrack = queue[currentIndex] ?? null;

  // expo-audio: cria o player com a URI da faixa atual
  const player = useAudioPlayer(
    currentTrack ? { uri: currentTrack.uri } : null,
    (p) => {
      // Avança ao terminar
      if (p.didJustFinish && !isLooping) {
        skipNextRef.current?.();
      }
    }
  );

  const status = useAudioPlayerStatus(player);

  // Ref para skipNext sem dependency hell
  const skipNextRef = useRef(null);

  // Toca assim que o player carrega
  useEffect(() => {
    if (currentTrack && player) {
      player.play();
    }
  }, [currentIndex]); // eslint-disable-line

  // ── Controles ───────────────────────────────
  const play = useCallback((tracks, startIndex = 0) => {
    if (tracks) {
      setQueue(tracks);
      setCurrentIndex(startIndex);
    } else {
      player?.play();
    }
  }, [player]);

  const pause = useCallback(() => player?.pause(), [player]);

  const togglePlayPause = useCallback(() => {
    if (!player) return;
    status?.playing ? player.pause() : player.play();
  }, [player, status]);

  const seekTo = useCallback((ms) => {
    player?.seekTo(ms / 1000); // expo-audio usa segundos
  }, [player]);

  const skipNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (isShuffle) return Math.floor(Math.random() * queue.length);
      return prev < queue.length - 1 ? prev + 1 : 0;
    });
  }, [isShuffle, queue.length]);

  skipNextRef.current = skipNext;

  const skipPrev = useCallback(() => {
    const posMs = (status?.currentTime ?? 0) * 1000;
    if (posMs > 3000) { seekTo(0); return; }
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : queue.length - 1));
  }, [status, seekTo, queue.length]);

  const toggleLoop = useCallback(() => {
    const next = !isLooping;
    setIsLooping(next);
    if (player) player.loop = next;
  }, [isLooping, player]);

  const toggleShuffle = useCallback(() => setIsShuffle((s) => !s), []);

  const positionMs = (status?.currentTime ?? 0) * 1000;
  const durationMs = (status?.duration ?? 0) * 1000;
  const isPlaying = status?.playing ?? false;
  const isLoading = status?.isBuffering ?? false;

  const value = {
    currentTrack, queue, currentIndex,
    isPlaying, isLoading, positionMs, durationMs,
    isLooping, isShuffle,
    play, pause, togglePlayPause, seekTo,
    skipNext, skipPrev, toggleLoop, toggleShuffle,
    setQueue, setCurrentIndex,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio deve ser usado dentro de <AudioProvider>');
  return ctx;
}