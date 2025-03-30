// src/components/GestureCamera.js
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Camera } from 'expo-camera';

// Optimized camera component based on Expo documentation
const GestureCamera = ({ onFrame, isActive }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const lastProcessedTime = useRef(0);
  const processingFrame = useRef(false);
  const frameInterval = 300; // ms between frames (adjust based on performance needs)
  
  // Request camera permissions only once on mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  // Optimal camera settings for performance
  const cameraSettings = useMemo(() => ({
    // Use lower quality for faster processing
    quality: Platform.OS === 'ios' ? 0.5 : 0.4, 
    base64: true,
    exif: false, // Don't need EXIF data
    skipProcessing: true, // Skip extra image processing
    // Use a smaller image if on Android for speed
    width: Platform.OS === 'android' ? 640 : undefined,
    height: Platform.OS === 'android' ? 480 : undefined,
    fixOrientation: false, // Handle orientation in backend if needed
    imageType: 'jpeg', // JPEG is faster than PNG
  }), []);
  
  // Frame capturing logic - runs continuously when active
  const captureFrame = useCallback(async () => {
    if (!isActive || !cameraRef.current || processingFrame.current) return;
    
    const now = Date.now();
    if (now - lastProcessedTime.current < frameInterval) return;
    
    try {
      processingFrame.current = true;
      const photo = await cameraRef.current.takePictureAsync(cameraSettings);
      lastProcessedTime.current = now;
      processingFrame.current = false;
      
      // Call parent handler with the captured frame
      if (onFrame && photo.base64) {
        onFrame(photo.base64);
      }
    } catch (error) {
      console.error('Error capturing frame:', error);
      processingFrame.current = false;
    }
  }, [isActive, onFrame, cameraSettings]);
  
  // Set up frame capture interval
  useEffect(() => {
    let frameId;
    
    const scheduleNextFrame = () => {
      frameId = requestAnimationFrame(() => {
        captureFrame().finally(() => {
          if (isActive) scheduleNextFrame();
        });
      });
    };
    
    if (isActive && hasPermission) {
      scheduleNextFrame();
    }
    
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isActive, hasPermission, captureFrame]);
  
  if (hasPermission === null) {
    return <View style={styles.container} />;
  }
  
  if (hasPermission === false) {
    return <View style={styles.container} />;
  }
  
  return (
    <Camera
      ref={cameraRef}
      style={styles.camera}
      type={Camera.Constants.Type.back}
      ratio="16:9"
      // Use lower resolution when possible for better performance
      videoStabilizationMode={Camera.Constants.VideoStabilization.off}
      // Additional optimizations based on Expo Camera docs
      useCamera2Api={Platform.OS === 'android'} // Better performance on Android
      pictureSize="640x480" // Smaller picture size for faster processing
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
});

export default React.memo(GestureCamera); // Use memo for preventing unnecessary re-renders
