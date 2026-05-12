import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Importando os ícones

export default function FriendProfileScreen() {
  const route = useRoute();
  const navigation = useNavigation(); // Hook para usar a navegação
  
  const { friend } = route.params || { friend: { name: 'Amigo', avatar: 'https://i.pravatar.cc/150' } };

  return (
    <View style={styles.container}>
      
      {/* Botão de Voltar */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={18} color="#000000" />
      </TouchableOpacity>

      <Image source={{ uri: friend.avatar }} style={styles.cover} blurRadius={10} />
      
      <View style={styles.content}>
        <Image source={{ uri: friend.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{friend.name}</Text>
        <Text style={styles.sub}>Seguindo • 12 Playlists</Text>
        
        <Text style={styles.sectionTitle}>Recentemente ouvido</Text>
        <Text style={styles.emptyText}>Atividade de escuta privada no momento.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: '#121212' },
  
  backButton: { 
    position: 'absolute', 
    top: 50, 
    left: 20, 
    zIndex: 10,
    backgroundColor: '#9333ea', // Roxo vibrante da imagem
    width: 30,                  // Tamanho fixo para ser um círculo
    height: 28,
    borderRadius: 22.5,         // Metade do width/height para arredondar
    justifyContent: 'center',   // Centraliza o ícone verticalmente
    alignItems: 'center',       // Centraliza o ícone horizontalmente
    // Removendo sombras para ficar flat como na imagem
  },

  cover: { width: Dimensions.get('window').width, height: 200, opacity: 0.5 },
  content: { alignItems: 'center', marginTop: -60 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#121212' },
  name: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 15 },
  sub: { color: '#aaa', fontSize: 14, marginTop: 5 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 30, alignSelf: 'flex-start', marginLeft: 20 },
  emptyText: { color: '#555', marginTop: 20 },
});