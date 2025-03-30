// src/screens/GestureRecognitionScreen.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { detectGesture, cleanupAPI } from '../utils/api';
import { initAudio, playAudioFromBlob, cleanupAudio } from '../utils/audioPlayer';
import GestureCamera from '../components/GestureCamera';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants
const DETECTION_COOLDOWN = 1000; // ms between detections
const CONFIDENCE_THRESHOLD = 0.65; // Minimum confidence to accept

const GestureRecognitionScreen = () => {
  // State management with minimal re-renders
  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastDetectionTime, setLastDetectionTime] = useState(0);
  const [detectedGesture, setDetectedGesture] = useState(null);
  
  // Initialize audio on mount
  useEffect(() => {
    initAudio();
    
    // Cleanup on unmount
    return () => {
      cleanupAPI();
      cleanupAudio();
    };
  }, []);
  
  // Load saved settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('gestureSettings');
        if (savedSettings) {
          // Apply saved settings if needed
          console.log('Loaded settings:', JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);
  
  // Process each captured frame
  const handleFrame = useCallback(async (base64Image) => {
    // Skip if already processing or in cooldown period
    const now = Date.now();
    if (isProcessing || now - lastDetectionTime < DETECTION_COOLDOWN) return;
    
    try {
      setIsProcessing(true);
      
      // Detect gesture using API
      const result = await detectGesture(base64Image);
      
      // Process valid detection
      if (result && result.gesture && result.confidence > CONFIDENCE_THRESHOLD) {
        setDetectedGesture(result);
        setLastDetectionTime(now);
        
        // Generate and play speech
        if (result.interpretation) {
          const response = await fetch("http://your-backend-ip:8000/text-to-speech", {  // 🔥 Fixed syntax error
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: result.interpretation }),
          });
          
          if (response.ok) {
            const audioBlob = await response.blob();
            await playAudioFromBlob(audioBlob, result.gesture); // Cache common gestures
          }
        }
      }
    } catch (error) {
      console.error('Error processing frame:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, lastDetectionTime, setDetectedGesture, setLastDetectionTime, playAudioFromBlob]); // 🔥 Fixed missing dependencies
  
  // Memoized UI components
  const StatusDisplay = useMemo(() => (
    <View style={styles.statusBar}>
      <Text style={styles.statusText}>
        {isActive ? 'Analyzing Gestures' : 'Paused'}
      </Text>
      {isProcessing && <ActivityIndicator color="#fff" size="small" />}
    </View>
  ), [isActive, isProcessing]);
  
  const DetectionDisplay = useMemo(() => {
    if (!detectedGesture) return null;
    
    return (
      <View style={styles.detectionContainer}>
        <Text style={styles.gestureLabel}>
          {detectedGesture.gesture} ({Math.round(detectedGesture.confidence * 100)}%)
        </Text>
        {detectedGesture.interpretation && (
          <Text style={styles.interpretation}>{detectedGesture.interpretation}</Text>
        )}
      </View>
    );
  }, [detectedGesture]);
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Camera component (only active when needed) */}
      <GestureCamera 
        onFrame={handleFrame}
        isActive={isActive}
      />
      
      {/* UI Overlay */}
      <View style={styles.overlay}>
        {StatusDisplay}
        {DetectionDisplay}
        
        <TouchableOpacity
          style={[styles.button, isActive ? styles.stopButton : styles.startButton]}
          onPress={() => setIsActive(!isActive)}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            {isActive ? 'Stop' : 'Start'} Recognition
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detectionContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
    borderRadius: 8,
    marginTop: 'auto',
    marginBottom: 20,
  },
  gestureLabel: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  interpretation: {
    color: '#fff',
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default GestureRecognitionScreen;
