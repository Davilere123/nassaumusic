import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  useAnimatedValue,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAudio } from '../context/AudioContext';
import { Ionicons } from '@expo/vector-icons';

// ─────────────────────────────────────────────
//  MiniPlayer
//  Barra fixa no rodapé que aparece quando
//  há uma música carregada. Toca/pausa e
//  navega para a tela full do Player.
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
      activeOpacity={0.92}
      onPress={() => navigation.navigate('Player')}
    >
      {/* Barra de progresso fina no topo do mini player */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.row}>
        {/* Capa do álbum */}
        {currentTrack.artwork ? (
          <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
        ) : (
          <View style={[styles.artwork, styles.artworkFallback]}>
            <Ionicons name="musical-note" size={20} color="#a78bfa" />
          </View>
        )}

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist ?? 'Artista desconhecido'}
          </Text>
        </View>

        {/* Controles */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={togglePlayPause} hitSlop={12} style={styles.btn}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={26}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipNext} hitSlop={12} style={styles.btn}>
            <Ionicons name="play-skip-forward" size={22} color="#aaa" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: '#2d2d4e',
    paddingBottom: 4,
  },
  progressBarBg: {
    height: 2,
    backgroundColor: '#2d2d4e',
  },
  progressBarFill: {
    height: 2,
    backgroundColor: '#a78bfa',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  artwork: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  artworkFallback: {
    backgroundColor: '#2d2d4e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  artist: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btn: {
    padding: 4,
  },
});