import { AudioProvider } from './context/AudioContext';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        {/* navegação do João Pedro vai aqui */}
      </NavigationContainer>
    </AudioProvider>
  );
}
