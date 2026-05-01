import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, Dimensions, StatusBar, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAudio } from '../context/AudioContext';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const { width, height } = Dimensions.get('window');
const ARTWORK_SIZE = width * 0.75;

function formatTime(ms) {
  if (!ms || isNaN(ms) || ms <= 0) return '0:00';
  const total = Math.floor(ms / 1000);
  const min = Math.floor(total / 60);
  const sec = total % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export default function PlayerScreen() {
  const navigation = useNavigation();
  const {
    currentTrack, isPlaying, isLoading,
    positionMs, durationMs,
    isLooping, isShuffle,
    togglePlayPause, seekTo,
    skipNext, skipPrev,
    toggleLoop, toggleShuffle,
  } = useAudio();

  // Estado local do slider para não travar enquanto arrasta
  const [sliding, setSliding] = useState(false);
  const [slideValue, setSlideValue] = useState(0);

  const sliderValue = sliding ? slideValue : positionMs;
  const maxValue = durationMs > 0 ? durationMs : 1;

  const handleSlidingStart = useCallback((val) => {
    setSliding(true);
    setSlideValue(val);
  }, []);
  const handleSlidingChange = useCallback((val) => setSlideValue(val), []);
  const handleSlidingComplete = useCallback((val) => {
    setSliding(false);
    seekTo(val);
  }, [seekTo]);

  if (!currentTrack) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <Ionicons name="musical-notes-outline" size={48} color="#a78bfa" />
        </View>
        <Text style={styles.emptyTitle}>Nenhuma música tocando</Text>
        <Text style={styles.emptySubtitle}>Vá para a Home e escolha uma música</Text>
        <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.emptyBtnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progress = durationMs > 0 ? positionMs / durationMs : 0;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      {/* ── Fundo com blur de cor da capa ── */}
      <View style={styles.bgGlow} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={12}
        >
          <Ionicons name="chevron-down" size={26} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>TOCANDO AGORA</Text>
          {currentTrack.album ? (
            <Text style={styles.headerAlbum} numberOfLines={1}>
              {currentTrack.album}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity style={styles.headerBtn} hitSlop={12}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* ── Capa do Álbum ── */}
      <View style={styles.artworkWrapper}>
        <View style={[styles.artworkShadow, isPlaying && styles.artworkShadowActive]}>
          {currentTrack.artwork ? (
            <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
          ) : (
            <View style={[styles.artwork, styles.artworkFallback]}>
              <Ionicons name="musical-note" size={72} color="#a78bfa" />
            </View>
          )}
        </View>
      </View>

      {/* ── Info + Curtir ── */}
      <View style={styles.infoRow}>
        <View style={styles.infoText}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {currentTrack.artist ?? 'Artista desconhecido'}
          </Text>
        </View>
        <TouchableOpacity hitSlop={12} style={styles.likeBtn}>
          <Ionicons name="heart-outline" size={24} color="#a78bfa" />
        </TouchableOpacity>
      </View>

      {/* ── Slider de progresso ── */}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={maxValue}
          value={sliderValue}
          minimumTrackTintColor="#a78bfa"
          maximumTrackTintColor="#2d2d4e"
          thumbTintColor="#ffffff"
          onSlidingStart={handleSlidingStart}
          onValueChange={handleSlidingChange}
          onSlidingComplete={handleSlidingComplete}
          // FIX: garante que os valores são números, nunca strings
          step={1}
        />
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(sliderValue)}</Text>
          <Text style={styles.timeText}>
            {durationMs > 0 ? formatTime(durationMs) : '--:--'}
          </Text>
        </View>
      </View>

      {/* ── Controles principais ── */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleShuffle} hitSlop={12} style={styles.sideBtn}>
          <Ionicons
            name="shuffle"
            size={22}
            color={isShuffle ? '#a78bfa' : '#444'}
          />
          {isShuffle && <View style={styles.activeDot} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={skipPrev} hitSlop={12}>
          <Ionicons name="play-skip-back" size={32} color="#ddd" />
        </TouchableOpacity>

        {/* Botão Play/Pause principal */}
        <TouchableOpacity
          style={[styles.playBtn, isLoading && styles.playBtnLoading]}
          onPress={togglePlayPause}
          activeOpacity={0.85}
          disabled={isLoading}
        >
          <Ionicons
            name={isLoading ? 'ellipsis-horizontal' : isPlaying ? 'pause' : 'play'}
            size={30}
            color="#fff"
            style={!isPlaying && !isLoading ? { marginLeft: 3 } : null}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={skipNext} hitSlop={12}>
          <Ionicons name="play-skip-forward" size={32} color="#ddd" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleLoop} hitSlop={12} style={styles.sideBtn}>
          <Ionicons
            name="repeat"
            size={22}
            color={isLooping ? '#a78bfa' : '#444'}
          />
          {isLooping && <View style={styles.activeDot} />}
        </TouchableOpacity>
      </View>

      {/* ── Rodapé: dispositivo de saída ── */}
      <View style={styles.footer}>
        <Ionicons name="volume-medium-outline" size={16} color="#555" />
        <View style={styles.footerLine} />
        <Ionicons name="phone-portrait-outline" size={16} color="#555" />
      </View>
    </View>
  );
}

// ─── Estilos ────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#09090f',
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingHorizontal: 28,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },

  // Glow de fundo roxo suave
  bgGlow: {
    position: 'absolute',
    top: -100,
    left: -100,
    right: -100,
    height: height * 0.55,
    backgroundColor: '#1a0a2e',
    borderBottomLeftRadius: 999,
    borderBottomRightRadius: 999,
    opacity: 0.8,
  },

  // Empty state
  empty: {
    flex: 1, backgroundColor: '#09090f',
    alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  emptyIcon: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: '#1a0a2e',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  emptySubtitle: { color: '#555', fontSize: 14 },
  emptyBtn: {
    marginTop: 16, backgroundColor: '#a78bfa',
    paddingHorizontal: 32, paddingVertical: 12, borderRadius: 999,
  },
  emptyBtnText: { color: '#fff', fontWeight: '700' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 28,
  },
  headerBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerLabel: {
    color: '#666', fontSize: 10,
    letterSpacing: 2.5, fontWeight: '700',
  },
  headerAlbum: { color: '#ccc', fontSize: 13, marginTop: 2 },

  // Artwork
  artworkWrapper: { alignItems: 'center', marginBottom: 32 },
  artworkShadow: {
    borderRadius: 24,
    shadowColor: '#7c3aed',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  artworkShadowActive: {
    shadowOpacity: 0.55,
    shadowRadius: 40,
    elevation: 16,
  },
  artwork: {
    width: ARTWORK_SIZE, height: ARTWORK_SIZE,
    borderRadius: 24,
  },
  artworkFallback: {
    backgroundColor: '#1a0a2e',
    alignItems: 'center', justifyContent: 'center',
  },

  // Info
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 18,
  },
  infoText: { flex: 1 },
  trackTitle: {
    color: '#fff', fontSize: 22,
    fontWeight: '800', letterSpacing: 0.2,
  },
  trackArtist: { color: '#666', fontSize: 15, marginTop: 4 },
  likeBtn: { padding: 8 },

  // Slider
  sliderContainer: { marginBottom: 24 },
  slider: { width: '100%', height: 40 },
  timeRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: -6,
  },
  timeText: { color: '#555', fontSize: 12 },

  // Controls
  controls: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 36,
  },
  sideBtn: { alignItems: 'center', width: 32 },
  activeDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: '#a78bfa', marginTop: 4,
  },
  playBtn: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#7c3aed',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOpacity: 0.7,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  playBtnLoading: { backgroundColor: '#3d2060' },

  // Footer
  footer: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
  },
  footerLine: {
    flex: 1, height: 2,
    backgroundColor: '#1a1a2e', borderRadius: 1,
    maxWidth: 120,
  },
});