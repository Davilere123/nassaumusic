import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { tracks } from '../mockData';
import { useAudio } from '../context/AudioContext';

export default function LibraryScreen() {
  const { playTrack } = useAudio();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sua Biblioteca</Text>
      <FlatList
        data={tracks} // Agora as músicas aparecem aqui
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => playTrack(item)}>
            <Image source={{ uri: item.artwork }} style={styles.art} />
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.artist}>{item.artist}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  header: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  art: { width: 50, height: 50, borderRadius: 4, marginRight: 15 },
  title: { color: '#fff', fontSize: 16, fontWeight: '600' },
  artist: { color: '#aaa', fontSize: 13 },
});