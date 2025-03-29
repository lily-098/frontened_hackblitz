import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const settingsOptions = [
  { id: "1", title: "Account", icon: "person-outline" },
  { id: "2", title: "Notifications", icon: "notifications-outline" },
  { id: "3", title: "Privacy & Security", icon: "lock-closed-outline" },
  { id: "4", title: "Get Help", icon: "help-outline" },
  { id: "5", title: "About", icon: "information-circle-outline" },
];

const SettingsScreen = () => {
  const [search, setSearch] = useState("");

  const filteredOptions = settingsOptions.filter((option) =>
    option.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search settings..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#999"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredOptions.map((option) => (
          <TouchableOpacity key={option.id} style={styles.option}>
            <Ionicons name={option.icon} size={24} color="#007AFF" style={styles.icon} />
            <Text style={styles.optionText}>{option.title}</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "lavender", padding: 15 },
  searchBar: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 20,
    marginBottom: 80,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    elevation: 3,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom:20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  icon: { marginRight: 15 },
  optionText: { flex: 1, fontSize: 18, fontWeight: "500", color: "#333" },
});

export default SettingsScreen;
