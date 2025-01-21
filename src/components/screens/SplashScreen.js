import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";


export default function SplashScreen({ navigation }) {
  useEffect(() => {
    
    const timer = setTimeout(() => {
      navigation.replace("Landing");
    }, 2000); 

   
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/recipe-logo.png')} style={styles.logo} />
      <Text style={styles.text}>Welcome to Recipe App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fef4f2", 
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e85234",
  },
});
