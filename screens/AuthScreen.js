import React, { useState } from 'react';
import { 
  Alert,
  Keyboard,
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
import { useDatabase } from '../context/DatabaseContext';

export default function AuthScreen({ onLogin }) {
  const [viewMode, setViewMode] = useState('welcome'); 
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const db = useDatabase();

  const handleAuth = async () => {
    // 1. Fechar o teclado para evitar deadlocks de desmontagem da UI
    Keyboard.dismiss();

    if (nome.trim() === '' || senha.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha nome e senha!');
      return;
    }
    if (senha.length < 8) {
      Alert.alert('Erro', 'A senha precisa ter no mínimo 8 caracteres.');
      return;
    }

    try {
      if (viewMode === 'register') {
        const existingUser = await db.getFirstAsync('SELECT * FROM usuario WHERE Nome = ?', nome.trim());
        
        if (existingUser) {
          Alert.alert('Erro', 'Este nome já está em uso. Tente outro ou faça login.');
          return;
        }

        const newId = Date.now().toString(); 
        // Cria um e-mail fictício usando o nome sem espaços para satisfazer a regra UNIQUE do DB
        const dummyEmail = `${nome.trim().replace(/\s/g, '').toLowerCase()}${newId}@nassaumusic.app`;

        // Passando parâmetros separados em vez de array para compatibilidade máxima com expo-sqlite
        await db.runAsync(
          'INSERT INTO usuario (id, Nome, Email, Senha) VALUES (?, ?, ?, ?)',
          newId, nome.trim(), dummyEmail, senha
        );
        
        Alert.alert('Sucesso', 'Conta criada com sucesso!', [
          { 
            text: 'OK', 
            onPress: () => {
              // Delay seguro para evitar travamento da animação da transição de telas
              setTimeout(() => onLogin(), 150);
            } 
          }
        ]);
      } else if (viewMode === 'login') {
        const user = await db.getFirstAsync(
          'SELECT * FROM usuario WHERE Nome = ? AND Senha = ?',
          nome.trim(), senha
        );
        
        if (user) {
          // Delay seguro
          setTimeout(() => onLogin(), 150);
        } else {
          Alert.alert('Erro', 'Nome ou senha incorretos.');
        }
      }
    } catch (error) {
      console.error('[AuthScreen] Erro no banco de dados:', error);
      Alert.alert('Erro', 'Ocorreu um problema ao conectar com o banco de dados.');
    }
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