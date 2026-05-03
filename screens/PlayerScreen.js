// screens/PlayerScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useAudio } from '../context/AudioContext';

export default function PlayerScreen() {
  const { currentTrack, isPlaying, isLoading, togglePlayPause, positionMs, durationMs, seekTo } = useAudio();

  if (!currentTrack) return <View style={{flex:1, backgroundColor:'#121212'}} />;

  return (
    <View style={styles.container}>
      <Image source={{ uri: currentTrack.artwork }} style={styles.art} />
      <Text style={styles.title}>{currentTrack.title}</Text>
      <Text style={styles.artist}>{currentTrack.artist}</Text>
      
      <Slider
        style={{width: Dimensions.get('window').width - 40, height: 40}}
        minimumValue={0}
        maximumValue={durationMs || 1}
        value={positionMs}
        onSlidingComplete={seekTo}
        minimumTrackTintColor="#9333ea"
      />

      <View style={styles.controls}>
        <TouchableOpacity 
          onPress={togglePlayPause} 
          // Forçamos a comparação para garantir que o resultado seja estritamente true ou false
          disabled={isLoading === true} 
        >
          <Ionicons 
            name={isPlaying === true ? "pause-circle" : "play-circle"} 
            size={80} 
            color="#9333ea" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}