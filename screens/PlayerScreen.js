import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, Dimensions, StatusBar, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useAudio } from '../context/AudioContext';

const { width } = Dimensions.get('window');
const ART = width * 0.76;

function fmt(ms) {
  if (!ms || isNaN(ms) || ms <= 0) return '0:00';
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

export default function PlayerScreen() {
  const navigation = useNavigation();
  const {
    currentTrack, isPlaying, isLoading,
    positionMs, durationMs, isLooping, isShuffle,
    togglePlayPause, seekTo, skipNext, skipPrev,
    toggleLoop, toggleShuffle,
  } = useAudio();

  const [sliding, setSliding] = useState(false);
  const [slideVal, setSlideVal] = useState(0);

  const val = sliding ? slideVal : positionMs;
  const max = durationMs > 0 ? durationMs : 1;

  const onStart = useCallback((v) => { setSliding(true); setSlideVal(v); }, []);
  const onChange = useCallback((v) => setSlideVal(v), []);
  const onDone = useCallback((v) => { setSliding(false); seekTo(v); }, [seekTo]);

  if (!currentTrack) {
    return (
      <View style={s.empty}>
        <View style={s.emptyCircle}>
          <Ionicons name="musical-notes-outline" size={44} color="#9333ea" />
        </View>
        <Text style={s.emptyTitle}>Nenhuma música tocando</Text>
        <TouchableOpacity style={s.emptyBtn} onPress={() => navigation.goBack()}>
          <Text style={s.emptyBtnTxt}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.screen}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity style={s.hBtn} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="chevron-down" size={26} color="#fff" />
        </TouchableOpacity>
        <View style={s.hCenter}>
          <Text style={s.hLabel}>TOCANDO AGORA</Text>
          {currentTrack.album ? (
            <Text style={s.hAlbum} numberOfLines={1}>{currentTrack.album}</Text>
          ) : null}
        </View>
        <TouchableOpacity style={s.hBtn} hitSlop={12}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#777" />
        </TouchableOpacity>
      </View>

      {/* ── Capa ── */}
      <View style={s.artWrap}>
        {currentTrack.artwork ? (
          <Image source={{ uri: currentTrack.artwork }} style={s.art} />
        ) : (
          <View style={[s.art, s.artFallback]}>
            <Ionicons name="musical-note" size={80} color="#9333ea" />
          </View>
        )}
      </View>

      {/* ── Info + Like ── */}
      <View style={s.infoRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.trackTitle} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={s.trackArtist} numberOfLines={1}>{currentTrack.artist ?? 'Desconhecido'}</Text>
        </View>
        <TouchableOpacity hitSlop={12}>
          <Ionicons name="heart-outline" size={26} color="#9333ea" />
        </TouchableOpacity>
      </View>

      {/* ── Slider ── */}
      <View style={s.sliderWrap}>
        <Slider
          style={s.slider}
          minimumValue={0}
          maximumValue={max}
          value={val}
          step={1}
          minimumTrackTintColor="#9333ea"
          maximumTrackTintColor="#2a2a40"
          thumbTintColor="#ffffff"
          onSlidingStart={onStart}
          onValueChange={onChange}
          onSlidingComplete={onDone}
        />
        <View style={s.timeRow}>
          <Text style={s.time}>{fmt(val)}</Text>
          <Text style={s.time}>-{fmt(Math.max(0, durationMs - val))}</Text>
        </View>
      </View>

      {/* ── Controles ── */}
      <View style={s.controls}>
        <TouchableOpacity onPress={toggleShuffle} hitSlop={12} style={s.sideBtn}>
          <Ionicons name="shuffle" size={22} color={isShuffle ? '#9333ea' : '#444'} />
          {isShuffle && <View style={s.dot} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={skipPrev} hitSlop={12}>
          <Ionicons name="play-skip-back" size={32} color="#ddd" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.playBtn, isLoading && { backgroundColor: '#3b1070' }]}
          onPress={togglePlayPause}
          activeOpacity={0.85}
          disabled={isLoading}
        >
          <Ionicons
            name={isLoading ? 'ellipsis-horizontal' : isPlaying ? 'pause' : 'play'}
            size={30} color="#fff"
            style={!isPlaying && !isLoading ? { marginLeft: 3 } : null}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={skipNext} hitSlop={12}>
          <Ionicons name="play-skip-forward" size={32} color="#ddd" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleLoop} hitSlop={12} style={s.sideBtn}>
          <Ionicons name="repeat" size={22} color={isLooping ? '#9333ea' : '#444'} />
          {isLooping && <View style={s.dot} />}
        </TouchableOpacity>
      </View>

      {/* ── Rodapé ── */}
      <View style={s.footer}>
        <Ionicons name="bluetooth" size={14} color="#555" />
        <Text style={s.footerTxt}>Alto-falante</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1, backgroundColor: '#0a0a14',
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingHorizontal: 28,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  empty: {
    flex: 1, backgroundColor: '#0a0a14',
    alignItems: 'center', justifyContent: 'center', gap: 14,
  },
  emptyCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: '#1a0a2e',
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  emptyTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  emptyBtn: {
    backgroundColor: '#9333ea', paddingHorizontal: 32,
    paddingVertical: 12, borderRadius: 999, marginTop: 8,
  },
  emptyBtnTxt: { color: '#fff', fontWeight: '700' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  hBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center', justifyContent: 'center',
  },
  hCenter: { flex: 1, alignItems: 'center' },
  hLabel: { color: '#555', fontSize: 10, letterSpacing: 2.5, fontWeight: '700' },
  hAlbum: { color: '#ccc', fontSize: 13, marginTop: 2 },
  artWrap: {
    alignItems: 'center', marginBottom: 32,
    shadowColor: '#7c3aed', shadowOpacity: 0.45,
    shadowRadius: 36, shadowOffset: { width: 0, height: 12 }, elevation: 14,
  },
  art: { width: ART, height: ART, borderRadius: 22 },
  artFallback: { backgroundColor: '#160830', alignItems: 'center', justifyContent: 'center' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  trackTitle: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: 0.2 },
  trackArtist: { color: '#666', fontSize: 15, marginTop: 4 },
  sliderWrap: { marginBottom: 26 },
  slider: { width: '100%', height: 40 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -6 },
  time: { color: '#555', fontSize: 12 },
  controls: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 36,
  },
  sideBtn: { alignItems: 'center', width: 32 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#9333ea', marginTop: 4 },
  playBtn: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#9333ea', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#9333ea', shadowOpacity: 0.7, shadowRadius: 22,
    shadowOffset: { width: 0, height: 6 }, elevation: 12,
  },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  footerTxt: { color: '#555', fontSize: 13 },
});