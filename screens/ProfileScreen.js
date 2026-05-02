import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/150?u=me' }} 
          style={styles.avatar} 
        />
        <Text style={styles.userName}>Seu Nome</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={20} color="#fff" />
          <Text style={styles.menuText}>Configurações e Privacidade</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, { marginTop: 20 }]}>
          <Ionicons name="log-out-outline" size={20} color="#ff4444" />
          <Text style={[styles.menuText, { color: '#ff4444' }]}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  header: { alignItems: 'center', marginTop: 50 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
  userName: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  editBtn: { marginTop: 10, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#555' },
  editBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  menu: { marginTop: 40 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  menuText: { color: '#fff', fontSize: 16, marginLeft: 15 },
});