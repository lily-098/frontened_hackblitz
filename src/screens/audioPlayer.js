// src/utils/audioPlayer.js
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

// Audio cache for previously played sounds
const audioCache = {};
let currentSound = null;

// Initialize audio settings once
export const initAudio = async () => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    return true;
  } catch (error) {
    console.error('Error initializing audio:', error);
    return false;
  }
};

// Convert blob to file and play
export const playAudioFromBlob = async (audioBlob, cacheKey = null) => {
  try {
    // Check cache first if cacheKey provided
    if (cacheKey && audioCache[cacheKey]) {
      await playSound(audioCache[cacheKey]);
      return true;
    }
    
    // Create unique temporary filename
    const fileName = `temp_audio_${Date.now()}.mp3`;
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
    
    // Convert blob to base64
    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64data = Buffer.from(arrayBuffer).toString('base64');

    // Save to file
    await FileSystem.writeAsStringAsync(fileUri, base64data, {
      encoding: FileSystem.Encoding.Base64, // ✅ Fixed EncodingType
    });

    // Load and play the sound
    const { sound } = await Audio.Sound.createAsync(
      { uri: fileUri }, 
      { shouldPlay: true, volume: 1.0 }
    );

    // Cache if needed
    if (cacheKey) {
      audioCache[cacheKey] = sound;
    }

    // Keep reference to current sound
    if (currentSound) {
      await currentSound.unloadAsync();
    }
    currentSound = sound;

    // Add completion handler
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        if (!cacheKey) {
          // Unload uncached sounds when finished
          await sound.unloadAsync();
          // Clean up temp file
          await FileSystem.deleteAsync(fileUri, { idempotent: true });
        }
      }
    });

    return true;
  } catch (error) {
    console.error('Error playing audio from blob:', error);
    return false;
  }
};

// Play a pre-loaded sound
const playSound = async (sound) => {
  try {
    if (currentSound && currentSound !== sound) {
      await currentSound.stopAsync().catch(() => {});
    }
    currentSound = sound;
    await sound.setPositionAsync(0);
    await sound.playAsync();
    return true;
  } catch (error) {
    console.error('Error playing sound:', error);
    return false;
  }
};

// Clean up all sounds
export const cleanupAudio = async () => {
  try {
    if (currentSound) {
      await currentSound.unloadAsync();
      currentSound = null;
    }

    // Unload all cached sounds
    const cacheSounds = Object.values(audioCache);
    await Promise.all(cacheSounds.map(sound => sound.unloadAsync()));

    // Clear cache
    Object.keys(audioCache).forEach(key => delete audioCache[key]);

    return true;
  } catch (error) {
    console.error('Error cleaning up audio:', error);
    return false;
  }
};
