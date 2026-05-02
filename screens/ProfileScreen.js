import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../context/AudioContext';
import { MOCK_PLAYLISTS, MOCK_TRACKS, MOCK_FRIENDS } from '../mockData';
import MiniPlayer from '../components/MiniPlayer';

const TABS = ['Playlists', 'Músicas', 'Amigos'];

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [tab, setTab] = useState('Playlists');
  const { play, currentTrack, isPlaying, togglePlayPause } = useAudio();

  return (
    <View style={s.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
        {/* ── Header back ── */}
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ── Avatar + nome ── */}
        <View style={s.avatarWrap}>
          <TouchableOpacity style={s.avatar} activeOpacity={0.8}>
            <Ionicons name="person" size={52} color="#9333ea" />
            <View style={s.avatarEdit}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={s.userName}>Seu nome</Text>
          </TouchableOpacity>
          <Text style={s.userHandle}>Seu Cantinho</Text>
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

        {/* ── Conteúdo por tab ── */}
        {tab === 'Playlists' && (
          <View style={s.list}>
            {MOCK_PLAYLISTS.map((pl) => (
              <TouchableOpacity
                key={pl.id}
                style={s.row}
                onPress={() => play(pl.tracks, 0)}
                activeOpacity={0.8}
              >
                <View style={[s.rowArt, pl.pinned && { backgroundColor: '#4c1d95' }]}>
                  <Ionicons name={pl.pinned ? 'heart' : 'musical-notes'} size={22} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowTitle}>{pl.name}</Text>
                  <Text style={s.rowSub}>
                    {pl.pinned ? '📌 Playlist' : 'Playlist'} • {pl.trackCount} músicas
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#333" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {tab === 'Músicas' && (
          <View style={s.list}>
            {MOCK_TRACKS.map((item, idx) => {
              const ativa = currentTrack?.id === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[s.row, ativa && s.rowAtiva]}
                  onPress={() => ativa ? togglePlayPause() : play(MOCK_TRACKS, idx)}
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
                  <Ionicons name="ellipsis-vertical" size={16} color="#444" />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {tab === 'Amigos' && (
          <View style={s.list}>
            {MOCK_FRIENDS.map((f) => (
              <TouchableOpacity
                key={f.id}
                style={s.row}
                onPress={() => navigation.navigate('FriendProfile', { friend: f })}
                activeOpacity={0.8}
              >
                <View style={s.friendAvatar}>
                  <Ionicons name="person" size={22} color="#9333ea" />
                  {f.listeningTo && <View style={s.onlineDot} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowTitle}>{f.name}</Text>
                  <Text style={s.rowSub}>
                    {f.playlists.length} playlist{f.playlists.length !== 1 ? 's' : ''}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#333" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Botões de configuração ── */}
        <View style={s.settingsBtns}>
          <TouchableOpacity style={s.settingsBtn}>
            <Ionicons name="mail-outline" size={18} color="#fff" style={{ marginRight: 10 }} />
            <Text style={s.settingsBtnTxt}>Alterar email ou senha</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.settingsBtn, { backgroundColor: '#9333ea' }]}>
            <Ionicons name="log-out-outline" size={18} color="#fff" style={{ marginRight: 10 }} />
            <Text style={s.settingsBtnTxt}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <MiniPlayer />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0a0a14' },
  topBar: {
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingHorizontal: 20, paddingBottom: 8,
  },
  avatarWrap: { alignItems: 'center', paddingVertical: 24, gap: 6 },
  avatar: {
    width: 96, height: 96, borderRadius: 24,
    backgroundColor: '#2d1b69', alignItems: 'center', justifyContent: 'center',
    marginBottom: 4, position: 'relative',
  },
  avatarEdit: {
    position: 'absolute', bottom: -4, right: -4,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#9333ea', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#0a0a14',
  },
  userName: { color: '#fff', fontSize: 20, fontWeight: '800' },
  userHandle: { color: '#777', fontSize: 14 },
  tabs: { flexDirection: 'row', justifyContent: 'center', gap: 10, paddingHorizontal: 20, marginBottom: 20 },
  tab: {
    paddingHorizontal: 18, paddingVertical: 8,
    borderRadius: 999, backgroundColor: '#18182a',
    borderWidth: 1, borderColor: '#2a2a40',
  },
  tabAtiva: { backgroundColor: '#9333ea', borderColor: '#9333ea' },
  tabTxt: { color: '#777', fontSize: 13, fontWeight: '600' },
  tabTxtAtiva: { color: '#fff' },
  list: { paddingHorizontal: 20, gap: 10, marginBottom: 24 },
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
  friendAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#2d1b69', alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#22c55e', borderWidth: 2, borderColor: '#18182a',
  },
  settingsBtns: { paddingHorizontal: 20, gap: 12, marginTop: 8, marginBottom: 8 },
  settingsBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#18182a', borderRadius: 16,
    paddingVertical: 16, borderWidth: 1, borderColor: '#2a2a40',
  },
  settingsBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
});