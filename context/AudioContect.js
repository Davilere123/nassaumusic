import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';

// ─────────────────────────────────────────────
//  AudioContext — estado global do player
//  Qualquer tela pode consumir sem recriar o som
// ─────────────────────────────────────────────

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const soundRef = useRef(null);          // instância do expo-av Sound
  const [queue, setQueue] = useState([]);  // fila de músicas
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  // Garante que o áudio continue em background (iOS & Android)
  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });
    return () => {
      // Limpa o som ao desmontar o provider (ex: logout)
      soundRef.current?.unloadAsync();
    };
  }, []);

  // ── Callback de status ──────────────────────
  const onPlaybackStatusUpdate = useCallback((status) => {
    if (!status.isLoaded) return;
    setPositionMs(status.positionMillis ?? 0);
    setDurationMs(status.durationMillis ?? 0);
    setIsPlaying(status.isPlaying);

    // Avança automático ao acabar a música
    if (status.didJustFinish && !status.isLooping) {
      skipNext();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Carregar e tocar uma faixa ──────────────
  const loadAndPlay = useCallback(async (track) => {
    try {
      setIsLoading(true);

      // Descarrega o som anterior se existir
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.uri },
        { shouldPlay: true, isLooping },
        onPlaybackStatusUpdate,
      );

      soundRef.current = sound;
      setIsPlaying(true);
    } catch (err) {
      console.error('[AudioContext] Erro ao carregar áudio:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isLooping, onPlaybackStatusUpdate]);

  // Quando o índice ou a fila mudam, carrega a faixa
  useEffect(() => {
    if (currentIndex >= 0 && queue[currentIndex]) {
      loadAndPlay(queue[currentIndex]);
    }
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Controles ───────────────────────────────
  const play = useCallback(async (tracks, startIndex = 0) => {
    if (tracks) {
      setQueue(tracks);
      setCurrentIndex(startIndex);
    } else if (soundRef.current) {
      await soundRef.current.playAsync();
    }
  }, []);

  const pause = useCallback(async () => {
    await soundRef.current?.pauseAsync();
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (!soundRef.current) return;
    isPlaying ? await pause() : await soundRef.current.playAsync();
  }, [isPlaying, pause]);

  const seekTo = useCallback(async (ms) => {
    await soundRef.current?.setPositionAsync(ms);
  }, []);

  const skipNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (isShuffle) {
        const next = Math.floor(Math.random() * queue.length);
        return next;
      }
      return prev < queue.length - 1 ? prev + 1 : 0;
    });
  }, [isShuffle, queue.length]);

  const skipPrev = useCallback(() => {
    // Se passou mais de 3s, recomeça a música atual
    if (positionMs > 3000) {
      seekTo(0);
      return;
    }
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : queue.length - 1));
  }, [positionMs, queue.length, seekTo]);

  const toggleLoop = useCallback(async () => {
    const next = !isLooping;
    setIsLooping(next);
    await soundRef.current?.setIsLoopingAsync(next);
  }, [isLooping]);

  const toggleShuffle = useCallback(() => setIsShuffle((s) => !s), []);

  // ── Valores expostos ────────────────────────
  const currentTrack = queue[currentIndex] ?? null;

  const value = {
    // Estado
    currentTrack,
    queue,
    currentIndex,
    isPlaying,
    isLoading,
    positionMs,
    durationMs,
    isLooping,
    isShuffle,
    // Ações
    play,
    pause,
    togglePlayPause,
    seekTo,
    skipNext,
    skipPrev,
    toggleLoop,
    toggleShuffle,
    setQueue,
    setCurrentIndex,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

// Hook de conveniência
export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio deve ser usado dentro de <AudioProvider>');
  return ctx;
}