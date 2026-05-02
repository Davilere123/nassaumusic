import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function FriendProfileScreen() {
  const route = useRoute();
  // Se você passar os dados do amigo via navegação, eles chegam aqui:
  const { friend } = route.params || { friend: { name: 'Amigo', avatar: 'https://i.pravatar.cc/150' } };

  return (
    <View style={styles.container}>
      <Image source={{ uri: friend.avatar }} style={styles.cover} blurRadius={10} />
      <View style={styles.content}>
        <Image source={{ uri: friend.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{friend.name}</Text>
        <Text style={styles.sub}>Seguindo • 12 Playlists</Text>
        
        <Text style={styles.sectionTitle}>Recentemente ouvido</Text>
        {/* Aqui você poderia listar as músicas que o amigo ouviu */}
        <Text style={styles.emptyText}>Atividade de escuta privada no momento.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  cover: { width: '100%', height: 200, opacity: 0.5 },
  content: { alignItems: 'center', marginTop: -60 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidht: 4, borderColor: '#121212' },
  name: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 15 },
  sub: { color: '#aaa', fontSize: 14, marginTop: 5 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 30, alignSelf: 'flex-start', marginLeft: 20 },
  emptyText: { color: '#555', marginTop: 20 },
});