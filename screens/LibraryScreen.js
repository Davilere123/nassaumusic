import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LibraryScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>U</Text></View>
        <Text style={styles.title}>Sua Biblioteca</Text>
      </View>
      
      <TouchableOpacity style={styles.item}>
        <View style={styles.heartBox}><Ionicons name="heart" size={24} color="#fff" /></View>
        <Text style={styles.itemText}>Músicas Curtidas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 30 },
  avatar: { width: 35, height: 35, borderRadius: 17, backgroundColor: '#9333ea', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  heartBox: { width: 50, height: 50, backgroundColor: '#9333ea', borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  itemText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});