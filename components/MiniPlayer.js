import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAudio } from '../context/AudioContext';
import { Ionicons } from '@expo/vector-icons';

// ─────────────────────────────────────────────
//  MiniPlayer — barra fixa no rodapé
//  Aparece automaticamente quando há música carregada
// ─────────────────────────────────────────────

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlayPause, skipNext, positionMs, durationMs } =
    useAudio();
  const navigation = useNavigation();

  if (!currentTrack) return null;

  const progress = durationMs > 0 ? positionMs / durationMs : 0;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.95}
      onPress={() => navigation.navigate('Player')}
    >
      {/* Barra de progresso no topo */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.row}>
        {/* Capa */}
        {currentTrack.artwork ? (
          <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
        ) : (
          <View style={[styles.artwork, styles.artworkFallback]}>
            <Ionicons name="musical-note" size={18} color="#a78bfa" />
          </View>
        )}

        {/* Título e artista */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist ?? 'Artista desconhecido'}
          </Text>
        </View>

        {/* Botões */}
        <View style={styles.btns}>
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation(); togglePlayPause(); }}
            hitSlop={12}
            style={styles.btn}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation(); skipNext(); }}
            hitSlop={12}
            style={styles.btn}
          >
            <Ionicons name="play-skip-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#13131f',
    borderTopWidth: 1,
    borderTopColor: '#1e1e35',
  },
  progressBg: {
    height: 2,
    backgroundColor: '#1e1e35',
  },
  progressFill: {
    height: 2,
    backgroundColor: '#7c3aed',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  artwork: {
    width: 42, height: 42, borderRadius: 10,
  },
  artworkFallback: {
    backgroundColor: '#1a0a2e',
    alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1 },
  title: {
    color: '#fff', fontSize: 13,
    fontWeight: '600',
  },
  artist: {
    color: '#666', fontSize: 12, marginTop: 2,
  },
  btns: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  btn: { padding: 6 },
});