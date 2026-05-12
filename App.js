import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Importação do Stack
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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator(); // Inicializando o Stack

// 1. Isolamos o Tab.Navigator em uma função separada
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
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

// 2. O App agora usa o Stack para gerenciar as rotas
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <SafeAreaProvider>
      <AudioProvider>
        
        {!isLoggedIn ? (
          <AuthScreen onLogin={() => setIsLoggedIn(true)} />
        ) : (
          <NavigationContainer>
            <View style={styles.container}>
              
              {/* O Stack.Navigator é o novo "chefe" */}
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* A tela principal é o pacote com as 3 abas */}
                <Stack.Screen name="MainTabs" component={MainTabs} />
                
                {/* As outras telas agora estão registradas aqui! */}
                <Stack.Screen name="PlaylistScreen" component={PlaylistScreen} />
                <Stack.Screen name="FriendProfileScreen" component={FriendProfileScreen} />
              </Stack.Navigator>

              {/* MiniPlayer fica fora do Stack para aparecer por cima de tudo */}
              <MiniPlayer />
              
            </View>
          </NavigationContainer>
        )}

      </AudioProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
});