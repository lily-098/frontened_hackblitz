// src/utils/api.js
import axios from 'axios';

// Configure base API settings
const API_BASE_URL = 'http://your-backend-ip:8000';

// Create an axios instance with optimized settings
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000, // Reduced timeout for faster error detection
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Track request cancellation tokens
const cancelTokens = {};

// Cancel any pending requests with the given ID
const cancelPendingRequests = (requestId) => {
  if (cancelTokens[requestId]) {
    cancelTokens[requestId].cancel('Operation canceled due to new request.');
    delete cancelTokens[requestId];
  }
};

// Get all available gestures (with caching)
let cachedGestures = null;
export const getGestures = async () => {
  try {
    // Return cached result if available
    if (cachedGestures) return cachedGestures;
    
    const response = await api.get('/gestures');
    cachedGestures = response.data.gestures;
    return cachedGestures;
  } catch (error) {
    console.error('Error fetching gestures:', error);
    return [];
  }
};

// Detect gesture from base64 image
export const detectGesture = async (base64Image, requestId = 'detect') => {
  // Cancel any pending requests with same ID
  cancelPendingRequests(requestId);
  
  // Create a new cancel token
  const source = axios.CancelToken.source();
  cancelTokens[requestId] = source;
  
  try {
    // Optimize by sending minimal data
    // Remove 'data:image/jpeg;base64,' prefix if present
    const imageData = base64Image.includes('data:image') 
      ? base64Image.split(',')[1] 
      : base64Image;
    
    const response = await api.post('/detect', {
      image: imageData
    }, {
      cancelToken: source.token
    });
    
    // Clean up the cancel token
    delete cancelTokens[requestId];
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return null;
    }
    console.error('Error detecting gesture:', error);
    return null;
  }
};

// Generate speech from text
export const textToSpeech = async (text, requestId = 'tts') => {
  cancelPendingRequests(requestId);
  const source = axios.CancelToken.source();
  cancelTokens[requestId] = source;
  
  try {
    const response = await api.post('/text-to-speech', {
      text: text
    }, {
      responseType: 'blob',
      cancelToken: source.token
    });
    
    delete cancelTokens[requestId];
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return null;
    }
    console.error('Error generating speech:', error);
    return null;
  }
};

// Clean up function to call when component unmounts
export const cleanupAPI = () => {
  Object.keys(cancelTokens).forEach(id => {
    cancelTokens[id].cancel('Request canceled due to component unmount');
  });
};

export default api;
