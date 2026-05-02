import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, FlatList, Image, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../context/AudioContext';
import { MOCK_TRACKS, MOCK_FRIENDS, MOCK_PLAYLISTS } from '../mockData';
import MiniPlayer from '../components/MiniPlayer';

// Cores para capas sem artwork
const FALLBACK_COLORS = ['#2d1b69', '#1a3a5c', '#1a472a', '#5c1a1a', '#2d2d1a'];

function ArtworkBox({ track, size = 80, radius = 12, index = 0 }) {
  if (track?.artwork) {
    return <Image source={{ uri: track.artwork }} style={{ width: size, height: size, borderRadius: radius }} />;
  }
  return (
    <View style={{
      width: size, height: size, borderRadius: radius,
      backgroundColor: FALLBACK_COLORS[index % FALLBACK_COLORS.length],
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Ionicons name="musical-notes" size={size * 0.35} color="rgba(255,255,255,0.35)" />
    </View>
  );
}

function FriendRow({ friend, onPlayTrack }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={s.friendRow}
      onPress={() => navigation.navigate('FriendProfile', { friend })}
      activeOpacity={0.8}
    >
      {/* Avatar */}
      <View style={s.friendAvatar}>
        <Ionicons name="person" size={22} color="#9333ea" />
        {friend.listeningTo && <View style={s.onlineDot} />}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={s.friendName}>{friend.name}</Text>
        {friend.listeningTo ? (
          <Text style={s.friendListening} numberOfLines={1}>
            🎵 {friend.listeningTo.title}
          </Text>
        ) : (
          <Text style={s.friendOffline}>Offline</Text>
        )}
      </View>

      {friend.listeningTo && (
        <TouchableOpacity
          style={s.friendPlayBtn}
          onPress={() => onPlayTrack(friend.listeningTo)}
          hitSlop={8}
        >
          <Ionicons name="play" size={14} color="#fff" />
        </TouchableOpacity>
      )}

      <Ionicons name="chevron-forward" size={16} color="#333" />
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const { play, currentTrack, isPlaying, togglePlayPause } = useAudio();

  const playTrack = (track) => play([track], 0);
  const playPlaylist = (playlist, idx = 0) => play(playlist.tracks, idx);

  return (
    <View style={s.screen}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Olá 👋</Text>
            <Text style={s.title}>Início</Text>
          </View>
          <TouchableOpacity
            style={s.avatarBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person" size={22} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* ── Reproduções recentes (horizontal) ── */}
        <Text style={s.sectionTitle}>Reproduções recentes</Text>
        <FlatList
          horizontal
          data={MOCK_TRACKS}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
          style={{ marginBottom: 28 }}
          renderItem={({ item, index }) => {
            const ativa = currentTrack?.id === item.id;
            return (
              <TouchableOpacity
                style={[s.recentCard, ativa && s.recentCardAtiva]}
                onPress={() => ativa ? togglePlayPause() : playTrack(item)}
                activeOpacity={0.8}
              >
                <View style={s.recentArtOverlay}>
                  <ArtworkBox track={item} size={130} radius={14} index={index} />
                  {ativa && isPlaying && (
                    <View style={s.playingBadge}>
                      <Ionicons name="musical-notes" size={12} color="#fff" />
                    </View>
                  )}
                </View>
                <Text style={s.recentTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={s.recentArtist} numberOfLines={1}>{item.artist}</Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* ── Playlists rápidas (2 colunas, igual ao design) ── */}
        <Text style={s.sectionTitle}>Suas playlists</Text>
        <View style={s.playlistGrid}>
          {MOCK_PLAYLISTS.map((pl, idx) => (
            <TouchableOpacity
              key={pl.id}
              style={s.playlistCard}
              onPress={() => playPlaylist(pl)}
              activeOpacity={0.8}
            >
              <View style={s.playlistArt}>
                <Ionicons name={pl.pinned ? 'heart' : 'musical-notes'} size={28} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.playlistName} numberOfLines={1}>{pl.name}</Text>
                <Text style={s.playlistCount}>{pl.trackCount} músicas</Text>
              </View>
              <Ionicons name="play-circle" size={30} color="#9333ea" />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Amigos ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Amigos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
            <Text style={s.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <View style={s.friendsList}>
          {MOCK_FRIENDS.map((f) => (
            <FriendRow key={f.id} friend={f} onPlayTrack={playTrack} />
          ))}
        </View>
      </ScrollView>

      <MiniPlayer />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0a0a14' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingHorizontal: 20, paddingBottom: 20,
  },
  greeting: { color: '#666', fontSize: 14 },
  title: { color: '#fff', fontSize: 30, fontWeight: '900', letterSpacing: 0.3 },
  avatarBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#18182a', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#2a2a40',
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff', fontSize: 18, fontWeight: '800',
    paddingHorizontal: 20, marginBottom: 14,
  },
  seeAll: { color: '#9333ea', fontSize: 13, fontWeight: '600' },

  // Recentes
  recentCard: { width: 140, alignItems: 'flex-start' },
  recentCardAtiva: {},
  recentArtOverlay: { position: 'relative', marginBottom: 8 },
  playingBadge: {
    position: 'absolute', bottom: 6, right: 6,
    backgroundColor: '#9333ea', borderRadius: 10,
    width: 22, height: 22, alignItems: 'center', justifyContent: 'center',
  },
  recentTitle: { color: '#fff', fontSize: 13, fontWeight: '600', maxWidth: 130 },
  recentArtist: { color: '#666', fontSize: 12, marginTop: 2 },

  // Playlists
  playlistGrid: { paddingHorizontal: 20, gap: 10, marginBottom: 28 },
  playlistCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#18182a', borderRadius: 14,
    padding: 12, gap: 14,
    borderWidth: 1, borderColor: '#2a2a40',
  },
  playlistArt: {
    width: 48, height: 48, borderRadius: 10,
    backgroundColor: '#2d1b69', alignItems: 'center', justifyContent: 'center',
  },
  playlistName: { color: '#fff', fontSize: 14, fontWeight: '700' },
  playlistCount: { color: '#666', fontSize: 12, marginTop: 2 },

  // Amigos
  friendsList: { paddingHorizontal: 20, gap: 10, marginBottom: 8 },
  friendRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#18182a', borderRadius: 14,
    padding: 14, gap: 12,
    borderWidth: 1, borderColor: '#2a2a40',
  },
  friendAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#2d1b69', alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#22c55e', borderWidth: 2, borderColor: '#18182a',
  },
  friendName: { color: '#fff', fontSize: 14, fontWeight: '700' },
  friendListening: { color: '#9333ea', fontSize: 12, marginTop: 2 },
  friendOffline: { color: '#555', fontSize: 12, marginTop: 2 },
  friendPlayBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#9333ea', alignItems: 'center', justifyContent: 'center',
  },
});