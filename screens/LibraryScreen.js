import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../context/AudioContext';
import { MOCK_PLAYLISTS, MOCK_TRACKS } from '../mockData';
import MiniPlayer from '../components/MiniPlayer';

const TABS = ['Playlists', 'Músicas'];

export default function LibraryScreen() {
  const [tab, setTab] = useState('Playlists');
  const navigation = useNavigation();
  const { play, currentTrack, isPlaying, togglePlayPause } = useAudio();

  const playPlaylist = (pl) => play(pl.tracks, 0);
  const playTrack = (track, idx) => play(MOCK_TRACKS, idx);

  return (
    <View style={s.screen}>
      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={s.title}>Biblioteca</Text>
        <TouchableOpacity style={s.addBtn}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ── Tabs ── */}
      <View style={s.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t}
            style={[s.tab, tab === t && s.tabAtiva]}
            onPress={() => setTab(t)}
          >
            <Text style={[s.tabTxt, tab === t && s.tabTxtAtiva]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'Playlists' ? (
        <FlatList
          data={MOCK_PLAYLISTS}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 20, gap: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={s.row}
              onPress={() => playPlaylist(item)}
              activeOpacity={0.8}
            >
              <View style={[s.rowArt, item.pinned && { backgroundColor: '#4c1d95' }]}>
                <Ionicons
                  name={item.pinned ? 'heart' : 'musical-notes'}
                  size={24} color="#fff"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowTitle}>{item.name}</Text>
                <Text style={s.rowSub}>
                  {item.pinned ? '📌 Playlist' : 'Playlist'} • {item.trackCount} músicas
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#333" />
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={MOCK_TRACKS}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 20, gap: 10 }}
          renderItem={({ item, index }) => {
            const ativa = currentTrack?.id === item.id;
            return (
              <TouchableOpacity
                style={[s.row, ativa && s.rowAtiva]}
                onPress={() => ativa ? togglePlayPause() : playTrack(item, index)}
                activeOpacity={0.8}
              >
                <View style={[s.rowArt, ativa && { backgroundColor: '#9333ea' }]}>
                  <Ionicons
                    name={ativa && isPlaying ? 'pause' : 'musical-note'}
                    size={22} color={ativa ? '#fff' : '#9333ea'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.rowTitle, ativa && { color: '#fff' }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={s.rowSub}>{item.artist} • {item.album}</Text>
                </View>
                <Ionicons name="ellipsis-vertical" size={18} color="#444" />
              </TouchableOpacity>
            );
          }}
        />
      )}

      <MiniPlayer />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0a0a14' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingHorizontal: 20, paddingBottom: 16,
  },
  title: { color: '#fff', fontSize: 30, fontWeight: '900' },
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#18182a', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#2a2a40',
  },
  tabs: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 4 },
  tab: {
    paddingHorizontal: 18, paddingVertical: 8,
    borderRadius: 999, backgroundColor: '#18182a',
    borderWidth: 1, borderColor: '#2a2a40',
  },
  tabAtiva: { backgroundColor: '#9333ea', borderColor: '#9333ea' },
  tabTxt: { color: '#777', fontSize: 13, fontWeight: '600' },
  tabTxtAtiva: { color: '#fff' },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#18182a', borderRadius: 14,
    padding: 14, gap: 14,
    borderWidth: 1, borderColor: '#2a2a40',
  },
  rowAtiva: { borderColor: '#9333ea', backgroundColor: '#1e0a38' },
  rowArt: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#2d1b69', alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: { color: '#bbb', fontSize: 14, fontWeight: '600' },
  rowSub: { color: '#555', fontSize: 12, marginTop: 3 },
});