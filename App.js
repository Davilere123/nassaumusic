import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importação do Contexto e Componentes
import { AudioProvider } from './context/AudioContext';
import MiniPlayer from './components/MiniPlayer';

// Importação das Telas
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import LibraryScreen from './screens/LibraryScreen';
import PlaylistScreen from './screens/PlaylistScreen';
import FriendProfileScreen from './screens/FriendProfileScreen';
import PlayerScreen from './screens/PlayerScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Menu de abas inferiores (Início, Buscar, Biblioteca)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopWidth: 0,
          height: 100,
          paddingBottom: 15,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#9333ea',
        tabBarInactiveTintColor: '#b3b3b3',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'musical-notes';
          if (route.name === 'Início') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Buscar') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Biblioteca') iconName = focused ? 'library' : 'library-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
      <Tab.Screen name="Biblioteca" component={LibraryScreen} />
    </Tab.Navigator>
  );
}

// CORREÇÃO ESSENCIAL: AppNavigator agora gerencia o fluxo de Autenticação nativamente
function AppNavigator({ isLoggedIn, onLogin }) {
  return (
    <View style={styles.container}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          // Tela de Autenticação gerenciada pelo React Navigation para evitar travamentos de desmontagem
          <Stack.Screen name="Auth">
            {(props) => <AuthScreen {...props} onLogin={onLogin} />}
          </Stack.Screen>
        ) : (
          <>
            {/* 1. Abas Principais */}
            <Stack.Screen name="MainTabs" component={MainTabs} />

        {/* 2. Tela de Playlist */}
        <Stack.Screen name="PlaylistScreen" component={PlaylistScreen} />

        {/* 3. Perfil do Amigo */}
        <Stack.Screen name="FriendProfileScreen" component={FriendProfileScreen} />

        {/* 4. Player Grande (Flutuando no topo do Stack para deslizar e cobrir as telas) */}
        <Stack.Screen
          name="PlayerScreen"
          component={PlayerScreen}
          options={{
            presentation: 'transparentModal',
            animation: 'slide_from_bottom'
          }}
        />
          </>
        )}
      </Stack.Navigator>

      {/* O MiniPlayer SÓ aparece se estiver logado para não quebrar a tela de Auth */}
      {isLoggedIn && <MiniPlayer />}
    </View>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Alterado temporariamente para pular o login quebrado

  return (
    <SafeAreaProvider>
      <AudioProvider>
        <NavigationContainer>
          <AppNavigator isLoggedIn={isLoggedIn} onLogin={() => setIsLoggedIn(true)} />
        </NavigationContainer>
      </AudioProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
});