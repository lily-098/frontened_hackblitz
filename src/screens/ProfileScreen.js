import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: "https://i.pravatar.cc/150" }} style={styles.profileImage} />
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoContainer}>
        <ProfileField label="Name" value={name} onChangeText={setName} />
        <ProfileField label="Email" value={email} onChangeText={setEmail} />
        <ProfileField label="Phone" value={phone} onChangeText={setPhone} />
        <ProfileField label="Birthday" value={birthday} onChangeText={setBirthday} />
        <ProfileField label="Password" value={password} onChangeText={setPassword} secureTextEntry={true} />
      </View>
      
      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const ProfileField = ({ label, value, onChangeText, secureTextEntry = false }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "lightblue", padding: 20 },
  profileHeader: { alignItems: "center", marginBottom: 20 },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: "#007AFF" },
  editButton: {
    position: "absolute",
    bottom: 5,
    right: 10,
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 20,
    elevation: 3,
  },
  infoContainer: { marginBottom: 20 },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: "500", color: "#333", marginBottom: 5 },
  input: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#ff3b30",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: { color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 10 },
});

export default ProfileScreen;
