import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  FlatList, TouchableOpacity, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../context/AudioContext';
import { MOCK_TRACKS, GENRES } from '../mockData';
import MiniPlayer from '../components/MiniPlayer';

const GENRE_COLORS = [
  '#7c3aed', '#1d4ed8', '#059669', '#b45309',
  '#be185d', '#0e7490', '#15803d', '#c2410c',
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { play, currentTrack, isPlaying, togglePlayPause } = useAudio();

  const filtered = query.trim().length > 0
    ? MOCK_TRACKS.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.artist.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const playTrack = (track, idx) => play(MOCK_TRACKS, idx);

  return (
    <View style={s.screen}>
      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={s.title}>Buscar</Text>
      </View>

      {/* ── Campo de busca ── */}
      <View style={s.searchBox}>
        <Ionicons name="search" size={18} color="#777" style={{ marginRight: 8 }} />
        <TextInput
          style={s.input}
          placeholder="Artistas e músicas"
          placeholderTextColor="#555"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color="#555" />
          </TouchableOpacity>
        )}
      </View>

      {query.trim().length > 0 ? (
        /* ── Resultados ── */
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 20, gap: 10 }}
          ListEmptyComponent={
            <View style={s.empty}>
              <Ionicons name="musical-notes-outline" size={48} color="#333" />
              <Text style={s.emptyTxt}>Nenhuma música encontrada</Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const ativa = currentTrack?.id === item.id;
            return (
              <TouchableOpacity
                style={[s.resultRow, ativa && s.resultRowAtiva]}
                onPress={() => ativa ? togglePlayPause() : playTrack(item, index)}
                activeOpacity={0.8}
              >
                <View style={[s.resultIcon, ativa && { backgroundColor: '#9333ea' }]}>
                  <Ionicons
                    name={ativa && isPlaying ? 'pause' : 'musical-note'}
                    size={18} color={ativa ? '#fff' : '#9333ea'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.resultTitle, ativa && { color: '#fff' }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={s.resultArtist}>{item.artist}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#333" />
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        /* ── Gêneros ── */
        <FlatList
          data={GENRES}
          keyExtractor={(g) => g}
          numColumns={2}
          contentContainerStyle={{ padding: 20, gap: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          ListHeaderComponent={<Text style={s.genreHeader}>Principais gêneros</Text>}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[s.genreCard, { backgroundColor: GENRE_COLORS[index % GENRE_COLORS.length] }]}
              activeOpacity={0.85}
            >
              <Text style={s.genreTxt}>{item}</Text>
              <Ionicons name="musical-notes" size={32} color="rgba(255,255,255,0.18)" />
            </TouchableOpacity>
          )}
        />
      )}

      <MiniPlayer />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0a0a14' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingHorizontal: 20, paddingBottom: 10,
  },
  title: { color: '#fff', fontSize: 30, fontWeight: '900' },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#18182a', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 12,
    marginHorizontal: 20, marginBottom: 20,
    borderWidth: 1, borderColor: '#2a2a40',
  },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  genreHeader: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 14 },
  genreCard: {
    flex: 1, height: 88, borderRadius: 14,
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'space-between', padding: 14,
  },
  genreTxt: { color: '#fff', fontSize: 16, fontWeight: '800' },
  resultRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#18182a', borderRadius: 14,
    padding: 14, gap: 14,
    borderWidth: 1, borderColor: '#2a2a40',
  },
  resultRowAtiva: { borderColor: '#9333ea', backgroundColor: '#1e0a38' },
  resultIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#2d1b69', alignItems: 'center', justifyContent: 'center',
  },
  resultTitle: { color: '#bbb', fontSize: 14, fontWeight: '600' },
  resultArtist: { color: '#555', fontSize: 12, marginTop: 2 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTxt: { color: '#444', fontSize: 15 },
});