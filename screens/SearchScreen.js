import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { recommendedAlbums } from '../mockData'; // Importa as playlists reais

export default function SearchScreen() {
  const navigation = useNavigation();

  // Cores para os cards das playlists
  const colors = ['#E8115B', '#148A08', '#BC5900', '#777777'];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Buscar</Text>
      <TextInput style={styles.searchInput} placeholder="O que você quer ouvir?" placeholderTextColor="#000" />
      
      <Text style={styles.sub}>Playlists para você</Text>
      <FlatList
        data={recommendedAlbums} // Usa as playlists do mockData (Rock Garagem, etc.)
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors[index % colors.length] }]}
            onPress={() => navigation.navigate('PlaylistScreen', { album: item })}
          >
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  header: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 40 },
  searchInput: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginTop: 20, marginBottom: 20 },
  sub: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  card: { flex: 1, height: 100, margin: 8, borderRadius: 8, padding: 12 },
  cardText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});