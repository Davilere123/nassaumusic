import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importação do Contexto e Componentes
import { AudioProvider } from './context/AudioContext';
import MiniPlayer from './components/MiniPlayer';

// Importação das Telas
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import LibraryScreen from './screens/LibraryScreen';
import PlaylistScreen from './screens/PlaylistScreen';
import FriendProfileScreen from './screens/FriendProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
    <AudioProvider>
      <NavigationContainer>
        {/* Usamos uma View envolta de tudo para o MiniPlayer não "sumir" sob as abas */}
        <View style={styles.container}>
          
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarStyle: {
                backgroundColor: '#121212', // Fundo escuro do menu
                borderTopWidth: 0,
                height: 60,
                paddingBottom: 8,
              },
              tabBarActiveTintColor: '#9333ea', // Roxo que você está usando
              tabBarInactiveTintColor: '#b3b3b3',
              tabBarIcon: ({ focused, color, size }) => {
                let iconName = 'musical-notes'; // Valor padrão caso algo falhe

                if (route.name === 'Início') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Buscar') {
                  iconName = focused ? 'search' : 'search-outline';
                } else if (route.name === 'Biblioteca') {
                  iconName = focused ? 'library' : 'library-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen name="Início" component={HomeScreen} />
            <Tab.Screen name="Buscar" component={SearchScreen} />
            <Tab.Screen name="Biblioteca" component={LibraryScreen} />
          </Tab.Navigator>

          {/* O MiniPlayer fica aqui para aparecer em todas as telas das abas */}
          <MiniPlayer />
          
        </View>
      </NavigationContainer>
    </AudioProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});