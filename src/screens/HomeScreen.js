import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const HomeDescriptionScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Welcome to Hand Gesture Interpreter</Text>
      <Text style={styles.subHeader}>Empowering Communication with Gesture Recognition</Text>
      
     
  
    
      
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "mistyrose", padding: 20 },
  header: { fontSize: 26, fontWeight: "bold", textAlign: "center",color: "#007AFF",backgroundColor:"black", marginBottom: 20 },
  subHeader: { fontSize: 18, textAlign: "center", color: "#555", marginBottom: 20 },
  section: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  title: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 5 },
  text: { fontSize: 16, color: "#555", lineHeight: 24 },
  footer: { fontSize: 18, textAlign: "center", fontWeight: "600", color: "#007AFF", marginTop: 20 },
});

export default HomeDescriptionScreen;
