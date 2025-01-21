import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome"; // Ikon yang valid

import SplashScreen from "./src/components/screens/SplashScreen";
import LandingScreen from "./src/components/screens/LandingScreen";
import LoginScreen from "./src/components/auth/Login";
import RegisterScreen from "./src/components/auth/Register";
import BerandaScreen from "./src/components/screens/BerandaScreen";
import AddRecipeScreen from "./src/components/screens/AddRecipeScreen";
import FavoritesScreen from "./src/components/screens/FavoritesScreen";
import ProfileScreen from "./src/components/screens/Profile";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TOKEN_EXPIRATION_DAYS = 2;

const getIconName = (routeName) => {
  switch (routeName) {
    case "Beranda":
      return "home";  
    case "AddRecipe":
      return "plus-circle";  
    case "Favorites":
      return "heart";
    case "Profile":
      return "user";  
    default:
      return "home";
  }
};

function MainTabNavigator({ handleLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <Icon name={getIconName(route.name)} size={size} color={color} />
        ),
        tabBarActiveTintColor: "#e85234",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Beranda"
        component={BerandaScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="AddRecipe"
        component={AddRecipeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="FavoritesScreen"
        component={FavoritesScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        options={{ headerShown: false }}
      >
        {(props) => <ProfileScreen {...props} onLogout={handleLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const tokenData = await AsyncStorage.getItem("token");
      if (tokenData) {
        const { token, expiry } = JSON.parse(tokenData);
        const now = new Date();
        if (new Date(expiry) > now) {
          setLoggedIn(false);  
        } else {
          await AsyncStorage.removeItem("token");
        }
      }
      setTimeout(() => {
        setSplashVisible(false);
      }, 2000); 
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async (token) => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + TOKEN_EXPIRATION_DAYS);
    await AsyncStorage.setItem(
      "token",
      JSON.stringify({ token, expiry: expiry.toISOString() })
    );
    setLoggedIn(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#e85234" barStyle="light-content" />
      {isSplashVisible ? (
        <SplashScreen />
      ) : (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: "#e85234" },
              headerTintColor: "#fff",
            }}
          >
            {isLoggedIn ? (
              <Stack.Screen name="Home" options={{ headerShown: false }}>
                {(props) => (
                  <MainTabNavigator {...props} handleLogout={handleLogout} />
                )}
              </Stack.Screen>
            ) : (
              <>
                <Stack.Screen
                  name="Landing"
                  component={LandingScreen} 
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Login"
                  options={{ headerShown: false }}
                >
                  {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
                </Stack.Screen>
                <Stack.Screen
                  name="Register"
                  component={RegisterScreen}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e85234",
  },
});
