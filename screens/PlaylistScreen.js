import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useAudio } from '../context/AudioContext';
import { tracks } from '../mockData'; // Importa suas músicas

export default function PlaylistScreen({ route }) {
  const { album } = route.params; // Recebe os dados do álbum clicado
  const { playTrack } = useAudio();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: album.image }} style={styles.cover} />
        <Text style={styles.title}>{album.title}</Text>
        <Text style={styles.sub}>Playlist • 2026</Text>
      </View>

      <FlatList
        data={tracks} // Aqui ela exibe as músicas que você adicionou
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
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 40 },
  cover: { width: 200, height: 200, borderRadius: 8 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 15 },
  sub: { color: '#aaa', fontSize: 14 },
  trackItem: { marginBottom: 15, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  trackTitle: { color: '#fff', fontSize: 16, fontWeight: '500' },
  trackArtist: { color: '#aaa', fontSize: 14 },
});