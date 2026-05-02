import { useAudio } from '../context/AudioContext';

export const useAudioProgress = () => {
  const { positionMs, durationMs } = useAudio();

  // Calcula a porcentagem (0 a 1) para o Slider
  const progress = durationMs > 0 ? positionMs / durationMs : 0;

  // Formata milissegundos em minutos:segundos (ex: 03:45)
  const formatTime = (millis) => {
    if (!millis) return "0:00";
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
  };

  return {
    progress,
    positionTime: formatTime(positionMs),
    durationTime: formatTime(durationMs),
  };
};