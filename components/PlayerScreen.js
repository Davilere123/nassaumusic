import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAudio } from '../context/AudioContext';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

// ─────────────────────────────────────────────
//  PlayerScreen  — tela full de reprodução
//  Design: dark roxo-profundo com capa grande
// ─────────────────────────────────────────────

const { width } = Dimensions.get('window');
const ARTWORK_SIZE = width * 0.78;

function formatTime(ms) {
  if (!ms || isNaN(ms)) return '0:00';
  const total = Math.floor(ms / 1000);
  const min = Math.floor(total / 60);
  const sec = total % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export default function PlayerScreen() {
  const navigation = useNavigation();
  const {
    currentTrack,
    isPlaying,
    isLoading,
    positionMs,
    durationMs,
    isLooping,
    isShuffle,
    togglePlayPause,
    seekTo,
    skipNext,
    skipPrev,
    toggleLoop,
    toggleShuffle,
  } = useAudio();

  // Evita erros se navegar para cá sem música
  if (!currentTrack) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="musical-notes-outline" size={64} color="#444" />
        <Text style={styles.emptyText}>Nenhuma música tocando</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="chevron-down" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>TOCANDO AGORA</Text>
          <Text style={styles.headerSub} numberOfLines={1}>
            {currentTrack.album ?? ''}
          </Text>
        </View>
        {/* Placeholder para menu de opções (três pontos) */}
        <TouchableOpacity hitSlop={12}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* ── Capa do Álbum ── */}
      <View style={styles.artworkContainer}>
        {currentTrack.artwork ? (
          <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
        ) : (
          <View style={[styles.artwork, styles.artworkFallback]}>
            <Ionicons name="musical-note" size={80} color="#a78bfa" />
          </View>
        )}
      </View>

      {/* ── Info + Like ── */}
      <View style={styles.infoRow}>
        <View style={styles.infoText}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {currentTrack.artist ?? 'Artista desconhecido'}
          </Text>
        </View>
        <TouchableOpacity hitSlop={12}>
          <Ionicons name="heart-outline" size={26} color="#a78bfa" />
        </TouchableOpacity>
      </View>

      {/* ── Barra de Progresso ── */}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={durationMs > 0 ? durationMs : 1}
          value={positionMs}
          minimumTrackTintColor="#a78bfa"
          maximumTrackTintColor="#333"
          thumbTintColor="#a78bfa"
          onSlidingComplete={(val) => seekTo(val)}
        />
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(positionMs)}</Text>
          <Text style={styles.timeText}>-{formatTime(durationMs - positionMs)}</Text>
        </View>
      </View>

      {/* ── Controles Principais ── */}
      <View style={styles.controls}>
        {/* Shuffle */}
        <TouchableOpacity onPress={toggleShuffle} hitSlop={12}>
          <Ionicons
            name="shuffle"
            size={24}
            color={isShuffle ? '#a78bfa' : '#555'}
          />
        </TouchableOpacity>

        {/* Anterior */}
        <TouchableOpacity onPress={skipPrev} hitSlop={12}>
          <Ionicons name="play-skip-back" size={34} color="#fff" />
        </TouchableOpacity>

        {/* Play / Pause */}
        <TouchableOpacity
          onPress={togglePlayPause}
          style={styles.playBtn}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <Ionicons
            name={isLoading ? 'hourglass-outline' : isPlaying ? 'pause' : 'play'}
            size={34}
            color="#fff"
          />
        </TouchableOpacity>

        {/* Próxima */}
        <TouchableOpacity onPress={skipNext} hitSlop={12}>
          <Ionicons name="play-skip-forward" size={34} color="#fff" />
        </TouchableOpacity>

        {/* Loop */}
        <TouchableOpacity onPress={toggleLoop} hitSlop={12}>
          <Ionicons
            name="repeat"
            size={24}
            color={isLooping ? '#a78bfa' : '#555'}
          />
        </TouchableOpacity>
      </View>

      {/* ── Rodapé (dispositivo de saída) ── */}
      <View style={styles.footer}>
        <Ionicons name="bluetooth" size={16} color="#888" />
        <Text style={styles.footerText}>
          {currentTrack.outputDevice ?? 'Alto-falante'}
        </Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
//  Estilos
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0d0d1a',
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    backgroundColor: '#0d0d1a',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  backBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#a78bfa',
    borderRadius: 24,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '700',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerLabel: {
    color: '#aaa',
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
  },
  headerSub: {
    color: '#fff',
    fontSize: 13,
    marginTop: 2,
  },

  // Artwork
  artworkContainer: {
    alignItems: 'center',
    marginBottom: 36,
    // Sombra suave embaixo da capa
    shadowColor: '#a78bfa',
    shadowOpacity: 0.35,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: 20,
  },
  artworkFallback: {
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Info
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  trackArtist: {
    color: '#888',
    fontSize: 15,
    marginTop: 4,
  },

  // Slider
  sliderContainer: {
    marginBottom: 24,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -6,
  },
  timeText: {
    color: '#666',
    fontSize: 12,
  },

  // Controls
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#a78bfa',
    alignItems: 'center',
    justifyContent: 'center',
    // Brilho no botão principal
    shadowColor: '#a78bfa',
    shadowOpacity: 0.6,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    color: '#888',
    fontSize: 13,
  },
});