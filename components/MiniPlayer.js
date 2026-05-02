import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../context/AudioContext';

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlayPause, isLoading } = useAudio();

  if (!currentTrack) return null;

  return (
    <View style={styles.container}>
      <Image source={{ uri: currentTrack.artwork }} style={styles.art} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {currentTrack.title}
          </Text>
        <Text style={styles.artist}>
          {currentTrack.artist}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60, backgroundColor: '#282828',
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, marginHorizontal: 8,
    borderRadius: 8, bottom: 5, position: 'absolute', width: '96%',
  },
  art: { width: 40, height: 40, borderRadius: 4 },
  info: { flex: 1, marginLeft: 12 },
  title: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  artist: { color: '#aaa', fontSize: 12 },
});