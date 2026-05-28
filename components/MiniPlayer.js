import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../context/AudioContext';
import { useNavigation } from '@react-navigation/native'; 

export default function MiniPlayer() {
  // AJUSTADO: Puxando positionMs para mostrar onde a música está
  const { currentTrack, isPlaying, togglePlayPause, isLoading, positionMs } = useAudio();
  const navigation = useNavigation();
  
  // Estado local para controlar se o Player Grande está visível ou não
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Monitora as mudanças de tela de forma segura usando os eventos nativos do Navigation
  useEffect(() => {
    // Quando o usuário navega para qualquer tela, checamos o nome dela
    const unsubscribe = navigation.addListener('state', (e) => {
      const state = e.data.state;
      if (!state) return;

      const currentRouteName = state.routes[state.index]?.name;
      
      if (currentRouteName === 'PlayerScreen') {
        setIsPlayerOpen(true);
      } else {
        setIsPlayerOpen(false);
      }
    });

    return unsubscribe;
  }, [navigation]);

  // NOVO: Função para formatar o tempo em minutos e segundos correntes (ex: 1:45)
  const formatTime = (millis) => {
    if (!millis || isNaN(millis)) return "0:00";
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // 1. Se não tiver música carregada, não renderiza nada
  if (!currentTrack) return null;

  // 2. Se o Player Grande estiver aberto por cima, esconde o MiniPlayer
  if (isPlayerOpen) return null;

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.9}
      onPress={() => navigation.navigate('PlayerScreen')} 
    >
      <Image source={{ uri: currentTrack.capa || currentTrack.artwork }} style={styles.art} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {currentTrack.titulo || currentTrack.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {currentTrack.artista || currentTrack.artist}
        </Text>
        {/* NOVO: Mostra apenas os minutos atuais rodando na música */}
        <Text style={styles.timeText}>
          {formatTime(positionMs)}
        </Text>
      </View>
      
      <TouchableOpacity 
          onPress={togglePlayPause}
          disabled={isLoading === true}
        >
        <Ionicons 
          name={isPlaying === true ? "pause" : "play"} 
          size={28} 
          color="#fff" 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60, 
    backgroundColor: '#282828',
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 12, 
    marginHorizontal: 8,
    borderRadius: 8, 
    bottom: 125, // Mantém a flutuação perfeita acima da sua TabBar
    position: 'absolute', 
    left: 8, 
    right: 8,
    zIndex: 999, 
    elevation: 5, 
  },
  art: { width: 40, height: 40, borderRadius: 4 },
  info: { flex: 1, marginLeft: 12 },
  title: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  artist: { color: '#aaa', fontSize: 12 },
  // NOVO: Estilo menor para o timer não brigar com as fontes maiores do título/artista
  timeText: {
    color: '#888',
    fontSize: 10,
    marginTop: 1
  }
});