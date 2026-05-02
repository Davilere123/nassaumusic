import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../context/AudioContext';

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlayPause, skipNext, positionMs, durationMs } = useAudio();
  const navigation = useNavigation();

  if (!currentTrack) return null;

  const progress = durationMs > 0 ? positionMs / durationMs : 0;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.95}
      onPress={() => navigation.navigate('Player')}
    >
      {/* Barra de progresso */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.row}>
        {currentTrack.artwork ? (
          <Image source={{ uri: currentTrack.artwork }} style={styles.art} />
        ) : (
          <View style={[styles.art, styles.artFallback]}>
            <Ionicons name="musical-note" size={18} color="#c084fc" />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist ?? 'Desconhecido'}</Text>
        </View>

        <TouchableOpacity
          onPress={(e) => { e.stopPropagation(); togglePlayPause(); }}
          hitSlop={12} style={styles.btn}
        >
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={(e) => { e.stopPropagation(); skipNext(); }}
          hitSlop={12} style={styles.btn}
        >
          <Ionicons name="play-skip-forward" size={22} color="#999" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#18182a', borderTopWidth: 1, borderTopColor: '#2a2a40' },
  progressBg: { height: 2, backgroundColor: '#2a2a40' },
  progressFill: { height: 2, backgroundColor: '#9333ea' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 12 },
  art: { width: 44, height: 44, borderRadius: 10 },
  artFallback: { backgroundColor: '#2a1050', alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  title: { color: '#fff', fontSize: 13, fontWeight: '600' },
  artist: { color: '#777', fontSize: 12, marginTop: 2 },
  btn: { padding: 6 },
});