import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

export default function SplashScreen() {
  return (
    <View style={styles.splashContainer}>
      <View style={styles.logoContainer}>
        <Icon name="clipboard-outline" size={80} color="#FFF" />
        <Text style={styles.splashTitle}>myToDo</Text>
      </View>
      <Text style={styles.splashSubtitle}>Your tasks, your rules</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f89700",
  },
  logoContainer: {
    alignItems: 'center',
  },
  splashTitle: {
    fontSize: 42,
    color: "#FFF",
    fontWeight: "bold",
    marginTop: 20,
  },
  splashSubtitle: {
    fontSize: 18,
    color: "#FFF",
    marginTop: 10,
    opacity: 0.8,
  },

});
