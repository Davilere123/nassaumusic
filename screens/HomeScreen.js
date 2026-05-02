// screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { friendsActivity, recommendedAlbums } from '../mockData';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Boa tarde</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn}><Ionicons name="notifications-outline" size={24} color="#fff" /></TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}><Ionicons name="time-outline" size={24} color="#fff" /></TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}><Ionicons name="settings-outline" size={24} color="#fff" /></TouchableOpacity>
          </View>
        </View>

        {/* Atividade dos Amigos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividade dos amigos</Text>
          <FlatList
            data={friendsActivity}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.friendCard}>
                <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
                <View style={styles.friendMusicIcon}><Ionicons name="musical-notes" size={12} color="#fff" /></View>
                <Text style={styles.friendName}>{item.name}</Text>
                <Text style={styles.friendListening} numberOfLines={1}>{item.listening}</Text>
              </View>
            )}
          />
        </View>

        {/* Recomendações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feito para você</Text>
          <FlatList
            data={recommendedAlbums}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.albumCard}>
                <Image source={{ uri: item.image }} style={styles.albumImage} />
                <Text style={styles.albumTitle}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, marginTop: 20 },
  greeting: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },
  iconBtn: { marginLeft: 16 },
  section: { marginTop: 24, paddingLeft: 16 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  friendCard: { width: 100, marginRight: 16, alignItems: 'center' },
  friendAvatar: { width: 60, height: 60, borderRadius: 30 },
  friendMusicIcon: { position: 'absolute', right: 20, bottom: 40, backgroundColor: '#9333ea', borderRadius: 10, padding: 4 },
  friendName: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginTop: 8 },
  friendListening: { color: '#aaa', fontSize: 10, textAlign: 'center' },
  albumCard: { marginRight: 16, width: 140 },
  albumImage: { width: 140, height: 140, borderRadius: 8 },
  albumTitle: { color: '#fff', marginTop: 8, fontSize: 13, fontWeight: '600' },
});