import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ContactUsScreen = () => {
  const contactOptions = [
    { id: "1", title: "WhatsApp", icon: "logo-whatsapp", url: "https://wa.me/1234567890" },
    { id: "2", title: "Instagram", icon: "logo-instagram", url: "https://instagram.com/example" },
    { id: "3", title: "Twitter", icon: "logo-twitter", url: "https://twitter.com/example" },
    { id: "4", title: "Facebook", icon: "logo-facebook", url: "https://facebook.com/example" },
    { id: "5", title: "Helpline", icon: "call-outline", url: "tel:+1234567890" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>For any Query...</Text>
      {contactOptions.map((option) => (
        <TouchableOpacity key={option.id} style={styles.option} onPress={() => Linking.openURL(option.url)}>
          <Ionicons name={option.icon} size={24} color="#007AFF" style={styles.icon} />
          <Text style={styles.optionText}>{option.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "grey", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "white" },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  icon: { marginRight: 15 },
  optionText: { fontSize: 18, fontWeight: "500", color: "white" },
});

export default ContactUsScreen;