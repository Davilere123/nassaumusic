import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';

const CATEGORIES = [
  { id: '1', title: 'Rock', color: '#E8115B' },
  { id: '2', title: 'Pop', color: '#148A08' },
  { id: '3', title: 'Hip-Hop', color: '#BC5900' },
  { id: '4', title: 'Indie', color: '#777777' },
];

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Buscar</Text>
      <TextInput style={styles.searchInput} placeholder="O que você quer ouvir?" placeholderTextColor="#000" />
      
      <Text style={styles.sub}>Navegar por todas as seções</Text>
      <FlatList
        data={CATEGORIES}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: item.color }]}>
            <Text style={styles.cardText}>{item.title}</Text>
          </View>
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