import React, { createContext, useContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [sound, setSound] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1); // Guarda o índice direto para pular sem delay
  const [playlist, setPlaylist] = useState([]); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);

  useEffect(() => {
    const setup = async () => {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    };
    setup();
  }, []);

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPositionMs(status.positionMillis);
      setDurationMs(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      
      if (status.didJustFinish) {
        playNext(); 
      }
    }
  };

  // FUNÇÃO PRINCIPAL: Carrega o áudio e mapeia o índice atual na memória
  const playTrack = async (track, newPlaylist = []) => {
    try {
      setIsLoading(true);
      
      if (sound) {
        await sound.unloadAsync().catch(() => {});
        setSound(null); 
      }

      // Delay seguro de 30 milissegundos
      await new Promise(resolve => setTimeout(resolve, 30));

      let targetPlaylist = playlist;
      if (newPlaylist && newPlaylist.length > 0) {
        setPlaylist(newPlaylist);
        targetPlaylist = newPlaylist;
      }

      // Salva o índice atual para os botões avançar/voltar usarem direto
      const index = targetPlaylist.findIndex(t => t.id === track.id);
      setCurrentTrackIndex(index);

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { 
          shouldPlay: true,
          positionMillis: 0,
          progressUpdateIntervalMillis: 500, 
          downloadFirst: false // Streaming direto sem travar na rede
        },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setCurrentTrack(track);
      setIsPlaying(true);
    } catch (e) {
      console.log("Erro ao tocar música:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const seekTo = async (value) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  // Avança usando o índice da memória (Loop Infinito se for a última)
  const playNext = async () => {
    if (!playlist || playlist.length === 0 || currentTrackIndex === -1) return;

    if (currentTrackIndex < playlist.length - 1) {
      const nextTrack = playlist[currentTrackIndex + 1];
      await playTrack(nextTrack);
    } else {
      const firstTrack = playlist[0];
      await playTrack(firstTrack);
    }
  };

  // Volta uma música usando o índice da memória
  const playPrevious = async () => {
    if (!playlist || playlist.length === 0 || currentTrackIndex === -1) return;

    if (currentTrackIndex === 0) {
      if (sound) {
        await sound.setPositionAsync(0); 
        setPositionMs(0);
      }
    } else {
      const prevTrack = playlist[currentTrackIndex - 1];
      await playTrack(prevTrack);
    }
  };

  return (
    <AudioContext.Provider value={{ 
      currentTrack, 
      isPlaying, 
      isLoading, 
      positionMs, 
      durationMs, 
      playTrack, 
      togglePlayPause,
      seekTo,
      playNext,       
      playPrevious,   
      playlist        
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);