import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';

import { AudioProvider } from './context/AudioContext';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import LibraryScreen from './screens/LibraryScreen';
import ProfileScreen from './screens/ProfileScreen';
import PlayerScreen from './screens/PlayerScreen';
import FriendProfileScreen from './screens/FriendProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ── Tab Navigator (Início / Buscar / Biblioteca) ──────────
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0f0f1a',
          borderTopColor: '#1e1e30',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 82 : 62,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#555',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Início: focused ? 'home' : 'home-outline',
            Buscar: focused ? 'search' : 'search-outline',
            Biblioteca: focused ? 'folder' : 'folder-outline',
          };
          return (
            <View style={focused ? {
              backgroundColor: '#9333ea',
              borderRadius: 10, padding: 4,
            } : {}}>
              <Ionicons name={icons[route.name]} size={focused ? 20 : size} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
      <Tab.Screen name="Biblioteca" component={LibraryScreen} />
    </Tab.Navigator>
  );
}

// ── Stack principal ───────────────────────────
export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen
            name="Player"
            component={PlayerScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="FriendProfile" component={FriendProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AudioProvider>
  );
}