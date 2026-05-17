import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useAudio } from '../context/AudioContext';

export default function PlayerScreen({ navigation }) {
  const { 
    currentTrack, 
    isPlaying, 
    isLoading, 
    togglePlayPause, 
    positionMs, 
    durationMs, 
    seekTo, 
    playNext,
    playPrevious 
  } = useAudio();

  // NOVO: Função para transformar os milissegundos dinâmicos em formato MM:SS
  const formatTime = (millis) => {
    if (!millis || isNaN(millis)) return "0:00";
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentTrack) return <View style={{flex:1, backgroundColor:'#121212'}} />;

  return (
    <View style={styles.container}>
      
      {/* Botão para fechar a tela */}
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-down" size={30} color="#fff" />
      </TouchableOpacity>

      <Image source={{ uri: currentTrack.artwork }} style={styles.art} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{currentTrack.title}</Text>
        <Text style={styles.artist}>{currentTrack.artist}</Text>
      </View>
      
      <Slider
        style={{width: Dimensions.get('window').width - 40, height: 40}}
        minimumValue={0}
        maximumValue={durationMs || 1}
        value={positionMs}
        onSlidingComplete={seekTo}
        minimumTrackTintColor="#9333ea"
        maximumTrackTintColor="#4f4f4f"
        thumbTintColor="#9333ea"
      />

      {/* NOVO: Mostrador de tempo corrido e tempo total alinhados nas pontas */}
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(positionMs)}</Text>
        <Text style={styles.timeText}>{formatTime(durationMs)}</Text>
      </View>

      {/* CONTROLES ATUALIZADOS: Bloqueia cliques repetidos usando disabled={isLoading} */}
      <View style={styles.controlsContainer}>
        
        {/* Botão de Voltar Música (Para Trás) */}
        <TouchableOpacity 
          onPress={playPrevious} 
          style={styles.backButton}
          activeOpacity={0.7}
          disabled={isLoading} // Bloqueia o clique se já estiver carregando
        >
          <Ionicons 
            name="play-back" 
            size={38} 
            color={isLoading ? "#4f4f4f" : "#fff"} // Fica cinza se estiver bloqueado
          />
        </TouchableOpacity>

        {/* Botão de Play/Pause */}
        <TouchableOpacity 
          onPress={togglePlayPause} 
          disabled={isLoading} 
        >
          <Ionicons 
            name={isPlaying === true ? "pause-circle" : "play-circle"} 
            size={80} 
            color={isLoading ? "#4f4f4f" : "#9333ea"} // Fica cinza se estiver bloqueado
          />
        </TouchableOpacity>

        {/* Botão de Avançar Música (Para Frente) */}
        <TouchableOpacity 
          onPress={playNext} 
          style={styles.skipButton}
          activeOpacity={0.7}
          disabled={isLoading} // Bloqueia o clique se já estiver carregando
        >
          <Ionicons 
            name="play-forward" 
            size={38} 
            color={isLoading ? "#4f4f4f" : "#fff"} // Fica cinza se estiver bloqueado
          />
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212', 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingBottom: 50 
  },
  header: { position: 'absolute', top: 40, left: 20, zIndex: 10 }, 
  art: { 
    width: Dimensions.get('window').width - 60, 
    height: Dimensions.get('window').width - 60, 
    borderRadius: 8,
    marginBottom: 40 
  },
  infoContainer: { width: '100%', paddingHorizontal: 25, marginBottom: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  artist: { color: '#b3b3b3', fontSize: 18 },
  
  // NOVO: Container para manter os tempos organizados abaixo do Slider
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width - 50,
    marginTop: -5,
    marginBottom: 15,
  },
  timeText: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
    position: 'relative'
  },
  backButton: {
    position: 'absolute',
    left: 65, 
  },
  skipButton: {
    position: 'absolute',
    right: 65, 
  }
});