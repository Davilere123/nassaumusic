import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useAudio } from '../context/AudioContext';
import { tracks } from '../mockData'; 
import { Ionicons } from '@expo/vector-icons'; // Importando os ícones

export default function PlaylistScreen({ route, navigation }) { // Adicionado 'navigation' aqui
  const { album } = route.params; 
  const { playTrack } = useAudio();

  return (
    <View style={styles.container}>
      
      {/* Botão de Voltar */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Image source={{ uri: album.image }} style={styles.cover} />
        <Text style={styles.title}>{album.title}</Text>
        <Text style={styles.sub}>Playlist • 2026</Text>
      </View>

      <FlatList
        data={tracks} 
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.trackItem} onPress={() => playTrack(item)}>
            <Text style={styles.trackTitle}>{item.title}</Text>
            <Text style={styles.trackArtist}>{item.artist}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingHorizontal: 20 },
  
  backButton: { 
    position: 'absolute', 
    top: 50, 
    left: 20, 
    zIndex: 10,
    backgroundColor: '#9333ea', 
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: { alignItems: 'center', marginBottom: 30, marginTop: 110 }, // Espaço para não bater no botão
  cover: { width: 200, height: 200, borderRadius: 8 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 15, textAlign: 'center' },
  sub: { color: '#aaa', fontSize: 14 },
  trackItem: { marginBottom: 15, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  trackTitle: { color: '#fff', fontSize: 16, fontWeight: '500' },
  trackArtist: { color: '#aaa', fontSize: 14 },
});