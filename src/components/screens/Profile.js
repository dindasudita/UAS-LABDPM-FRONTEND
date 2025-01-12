import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ onLogout }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const tokenData = await AsyncStorage.getItem("token");
        if (!tokenData) throw new Error("No token found");

        const { token } = JSON.parse(tokenData);
        const response = await fetch("http://10.234.235.4:3000/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const { data } = await response.json();
        setUserData(data);
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f89700" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load profile</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.profileCard}>
        <Text style={styles.label}>Nama Pengguna:</Text>
        <Text style={styles.value}>{userData.username}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userData.email}</Text>

        <Text style={styles.label}>Dibuat Sejak:</Text>
        <Text style={styles.value}>
          {new Date(userData.createdAt).toLocaleString()}
        </Text>
      </View>
      <Button title="Logout" onPress={onLogout} color="#f05454" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fef6e4",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#3B0918",
  },
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: "#f89700",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3a3a3a",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 12,
    color: "#555555",
  },
  errorText: {
    fontSize: 16,
    color: "#f05454",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
