import { AudioProvider } from './context/AudioContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlayerScreen from './components/PlayerScreen';
import MiniPlayer from './components/MiniPlayer';
import {
  View, Text, TouchableOpacity,
  StyleSheet, FlatList, StatusBar, Platform,
} from 'react-native';
import { useAudio } from './context/AudioContext';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

// ─────────────────────────────────────────────
//  Tela Home temporária de teste
//  Quando João Pedro fizer a navegação real,
//  isso aqui é removido e substituído.
// ─────────────────────────────────────────────

const FAIXAS_TESTE = [
  {
    id: '1',
    title: 'SoundHelix Song 1',
    artist: 'SoundHelix',
    album: 'Test Album',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    artwork: null,
  },
  {
    id: '2',
    title: 'SoundHelix Song 2',
    artist: 'SoundHelix',
    album: 'Test Album',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    artwork: null,
  },
  {
    id: '3',
    title: 'SoundHelix Song 3',
    artist: 'SoundHelix',
    album: 'Test Album',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    artwork: null,
  },
];

function HomeTemp() {
  const { play, currentTrack, isPlaying, togglePlayPause } = useAudio();

  const tocar = (index) => play(FAIXAS_TESTE, index);

  return (
    <View style={s.screen}>
      <StatusBar barStyle="light-content" />

      <View style={s.header}>
        <Text style={s.title}>NassauMusic</Text>
        <Text style={s.subtitle}>Tela de teste do player</Text>
      </View>

      <FlatList
        data={FAIXAS_TESTE}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        renderItem={({ item, index }) => {
          const ativa = currentTrack?.id === item.id;
          return (
            <TouchableOpacity
              style={[s.item, ativa && s.itemAtivo]}
              onPress={() => ativa ? togglePlayPause() : tocar(index)}
              activeOpacity={0.8}
            >
              {/* Ícone de nota / playing */}
              <View style={[s.itemIcon, ativa && s.itemIconAtivo]}>
                <Ionicons
                  name={ativa && isPlaying ? 'pause' : 'musical-note'}
                  size={20}
                  color={ativa ? '#fff' : '#a78bfa'}
                />
              </View>

              <View style={s.itemInfo}>
                <Text style={[s.itemTitle, ativa && s.itemTitleAtivo]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={s.itemArtist}>{item.artist}</Text>
              </View>

              <Ionicons name="chevron-forward" size={16} color="#333" />
            </TouchableOpacity>
          );
        }}
      />

      {/* Mini player fica acima da lista, colado na base */}
      <MiniPlayer />
    </View>
  );
}

// ─── Estilos da Home de teste ────────────────
const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#09090f',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 64 : 44,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e35',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#555',
    fontSize: 13,
    marginTop: 4,
  },
  list: {
    padding: 16,
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13131f',
    borderRadius: 14,
    padding: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: '#1e1e35',
  },
  itemAtivo: {
    borderColor: '#7c3aed',
    backgroundColor: '#1a0a2e',
  },
  itemIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#1e1e35',
    alignItems: 'center', justifyContent: 'center',
  },
  itemIconAtivo: {
    backgroundColor: '#7c3aed',
  },
  itemInfo: { flex: 1 },
  itemTitle: {
    color: '#bbb', fontSize: 14, fontWeight: '600',
  },
  itemTitleAtivo: { color: '#fff' },
  itemArtist: {
    color: '#555', fontSize: 12, marginTop: 3,
  },
});

// ─────────────────────────────────────────────
//  App principal
// ─────────────────────────────────────────────
export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeTemp} />
          <Stack.Screen
            name="Player"
            component={PlayerScreen}
            options={{ presentation: 'modal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AudioProvider>
  );
}