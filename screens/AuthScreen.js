import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { Ionicons } from '@expo/vector-icons';

export default function AuthScreen({ onLogin }) {
  const [viewMode, setViewMode] = useState('welcome'); 
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');

  const handleAuth = () => {
    if (nome.trim() === '' || senha.trim() === '') {
      alert('Por favor, preencha nome e senha!');
      return;
    }
    if (senha.length < 8) {
      alert('A senha precisa de 8 caracteres.');
      return;
    }
    onLogin();
  };

  if (viewMode === 'welcome') {
    return (
      <View style={styles.container}>
        <View style={styles.topView} />
        <View style={styles.welcomeContent}>
          <Text style={styles.logoIcon}>🎵</Text>
          <Text style={styles.title}>Bem-vindo{"\n"}ao NassauMusic</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setViewMode('register')}>
            <Text style={styles.primaryButtonText}>Crie uma conta</Text>
          </TouchableOpacity>
          <Text style={styles.ouText}>Ou</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setViewMode('login')}>
            <Text style={styles.secondaryButtonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
        <View style={styles.formHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => setViewMode('welcome')}>
            <Ionicons name="chevron-back-circle" size={32} color="#9333ea" />
          </TouchableOpacity>
          <Text style={styles.formTitle}>
            {viewMode === 'register' ? 'Crie uma conta' : 'Entrar na conta'}
          </Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.formContent}>
          <Text style={styles.label}>Qual o seu nome?</Text>
          <TextInput 
            style={styles.input} 
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome"
            placeholderTextColor="#666"
            autoCapitalize="words"
          />
          <Text style={styles.label}>Digite sua senha.</Text>
          <TextInput 
            style={styles.input} 
            value={senha}
            onChangeText={setSenha}
            placeholder="No mínimo 8 caracteres"
            placeholderTextColor="#666"
            secureTextEntry
          />
          <View style={styles.actionBtnContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleAuth}>
              <Text style={styles.actionButtonText}>Avançar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  topView: { width: '100%', height: 350, borderBottomLeftRadius: 150, borderBottomRightRadius: 150, backgroundColor: '#1e1e1e' },
  welcomeContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  logoIcon: { fontSize: 40, marginBottom: 10 },
  title: { color: '#fff', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 50 },
  primaryButton: { backgroundColor: '#a855f7', width: '100%', paddingVertical: 15, borderRadius: 25, alignItems: 'center', marginBottom: 20 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  ouText: { color: '#fff', fontSize: 14, marginBottom: 20 },
  secondaryButton: { backgroundColor: 'transparent', width: '100%', paddingVertical: 15, borderRadius: 25, alignItems: 'center', borderWidth: 2, borderColor: '#a855f7' },
  secondaryButtonText: { color: '#a855f7', fontSize: 16, fontWeight: 'bold' },
  formHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10, marginBottom: 40 },
  backButton: { padding: 5 },
  formTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  formContent: { paddingHorizontal: 20 },
  label: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 20 },
  input: { backgroundColor: '#333', borderRadius: 5, padding: 15, color: '#fff', fontSize: 16 },
  actionBtnContainer: { alignItems: 'center', marginTop: 40 },
  actionButton: { backgroundColor: '#a855f7', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});