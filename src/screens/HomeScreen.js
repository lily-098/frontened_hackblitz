import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";

const HomeDescriptionScreen = () => {
  const handleSignToText = async () => {
    try {
      const response = await fetch("http://YOUR_BACKEND_IP:PORT:http://0.0.0.0:8000/start-main", {
        method: "POST",
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", "Webcam started successfully!");
      } else {
        Alert.alert("Error", data.message || "Failed to start the webcam.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Could not connect to the server.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Welcome to Hand Gesture Interpreter</Text>
      <Text style={styles.subHeader}>Empowering Communication with Gesture Recognition</Text>
      
      {/* Button for Sign to Text */}
      <TouchableOpacity style={styles.button} onPress={handleSignToText}>
        <Text style={styles.buttonText}>* SIGN to TEXT *</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "mistyrose", padding: 20 },
  header: { fontSize: 26, fontWeight: "bold", textAlign: "center", color: "#007AFF", backgroundColor: "black", marginBottom: 20 },
  subHeader: { fontSize: 18, textAlign: "center", color: "#555", marginBottom: 20 },
  button: { backgroundColor: "white", padding: 15, borderRadius: 10, alignItems: "center", elevation: 3 },
  buttonText: { fontSize: 22, fontWeight: "bold", color: "grey" },
});

export default HomeDescriptionScreen;
