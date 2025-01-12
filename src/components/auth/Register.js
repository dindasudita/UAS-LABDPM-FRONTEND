import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://10.234.235.4:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Success", 
          "Registration successful! Please login.",
          [{ text: "OK", onPress: () => navigation.navigate("Login") }]
        );
      } else {
        Alert.alert("Error", data.message || "Registration failed");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to connect to server");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.registerContainer}
    >
      <ScrollView>
        <View style={styles.registerHeader}>
          <Icon name="person-add" size={60} color="#f89700" />
          <Text style={styles.registerTitle}>Create Account</Text>
          <Text style={styles.registerSubtitle}>Join us today!</Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Icon name="person-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#666"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Icon name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Icon name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Icon 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={styles.loginLinkTextBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  registerContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  registerHeader: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  registerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
  registerSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  inputContainer: {
    gap: 15,
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "#333",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
  },
  registerButton: {
    backgroundColor: "#f89700",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  loginLinkText: {
    fontSize: 16,
    color: "#666",
  },
  loginLinkTextBold: {
    color: "#f89700",
    fontWeight: "600",
  },
});
