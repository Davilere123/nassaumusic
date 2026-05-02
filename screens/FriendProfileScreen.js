import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../context/AudioContext';
import MiniPlayer from '../components/MiniPlayer';

export default function FriendProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { friend } = route.params;
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const { play, currentTrack, isPlaying, togglePlayPause } = useAudio();

  const playlist = selectedPlaylist
    ? friend.playlists.find((p) => p.id === selectedPlaylist)
    : null;

  return (
    <View style={s.screen}>
      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{friend.name}</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* ── Avatar + status ── */}
      <View style={s.profileWrap}>
        <View style={s.avatar}>
          <Ionicons name="person" size={44} color="#9333ea" />
          {friend.listeningTo && <View style={s.onlineDot} />}
        </View>
        <Text style={s.name}>{friend.name}</Text>
        {friend.listeningTo ? (
          <View style={s.listeningBadge}>
            <Ionicons name="musical-notes" size={13} color="#9333ea" />
            <Text style={s.listeningTxt} numberOfLines={1}>
              Ouvindo: {friend.listeningTo.title}
            </Text>
            <TouchableOpacity
              style={s.joinBtn}
              onPress={() => play([friend.listeningTo], 0)}
            >
              <Text style={s.joinBtnTxt}>Ouvir junto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={s.offlineTxt}>Offline</Text>
        )}
      </View>

      {/* ── Playlists do amigo ── */}
      {!selectedPlaylist ? (
        <FlatList
          data={friend.playlists}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: 20, gap: 10 }}
          ListHeaderComponent={
            <Text style={s.sectionTitle}>Playlists de {friend.name.split(' ')[0]}</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={s.row}
              onPress={() => setSelectedPlaylist(item.id)}
              activeOpacity={0.8}
            >
              <View style={s.rowArt}>
                <Ionicons name="musical-notes" size={22} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowTitle}>{item.name}</Text>
                <Text style={s.rowSub}>{item.trackCount} músicas</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#333" />
            </TouchableOpacity>
          )}
        />
      ) : (
        /* ── Músicas da playlist selecionada ── */
        <FlatList
          data={playlist?.tracks ?? []}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ padding: 20, gap: 10 }}
          ListHeaderComponent={
            <View style={{ marginBottom: 4 }}>
              <TouchableOpacity
                onPress={() => setSelectedPlaylist(null)}
                style={s.backToPlaylists}
              >
                <Ionicons name="chevron-back" size={16} color="#9333ea" />
                <Text style={s.backTxt}>Playlists</Text>
              </TouchableOpacity>
              <Text style={s.sectionTitle}>{playlist?.name}</Text>
              <TouchableOpacity
                style={s.playAllBtn}
                onPress={() => play(playlist.tracks, 0)}
              >
                <Ionicons name="play" size={16} color="#fff" />
                <Text style={s.playAllTxt}>Tocar tudo</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item, index }) => {
            const ativa = currentTrack?.id === item.id;
            return (
              <TouchableOpacity
                style={[s.row, ativa && s.rowAtiva]}
                onPress={() => ativa ? togglePlayPause() : play(playlist.tracks, index)}
                activeOpacity={0.8}
              >
                <View style={[s.rowArt, ativa && { backgroundColor: '#9333ea' }]}>
                  <Ionicons
                    name={ativa && isPlaying ? 'pause' : 'musical-note'}
                    size={20} color={ativa ? '#fff' : '#9333ea'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.rowTitle, ativa && { color: '#fff' }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={s.rowSub}>{item.artist}</Text>
                </View>
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
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingHorizontal: 20, paddingBottom: 8,
  },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  profileWrap: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  avatar: {
    width: 88, height: 88, borderRadius: 22,
    backgroundColor: '#2d1b69', alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute', bottom: -2, right: -2,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#22c55e', borderWidth: 2, borderColor: '#0a0a14',
  },
  name: { color: '#fff', fontSize: 20, fontWeight: '800' },
  listeningBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1e0a38', borderRadius: 999,
    paddingHorizontal: 14, paddingVertical: 8, gap: 6,
    maxWidth: '90%',
  },
  listeningTxt: { color: '#c084fc', fontSize: 13, flex: 1 },
  joinBtn: {
    backgroundColor: '#9333ea', borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  joinBtnTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
  offlineTxt: { color: '#555', fontSize: 14 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 14 },
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
  backToPlaylists: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  backTxt: { color: '#9333ea', fontSize: 14, fontWeight: '600' },
  playAllBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#9333ea', borderRadius: 14,
    paddingVertical: 12, paddingHorizontal: 20,
    alignSelf: 'flex-start', marginBottom: 16,
  },
  playAllTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
});