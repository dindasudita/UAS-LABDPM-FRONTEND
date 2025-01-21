import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BerandaScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteRecipes, setFavoriteRecipes] = useState(new Set());

  useEffect(() => {
    fetchRecipes();
    loadFavorites();
  }, []);

  useEffect(() => {
    saveFavorites();
  }, [favoriteRecipes]);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem("favoriteRecipes");
      if (savedFavorites) {
        setFavoriteRecipes(new Set(JSON.parse(savedFavorites)));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const saveFavorites = async () => {
    try {
      await AsyncStorage.setItem(
        "favoriteRecipes",
        JSON.stringify([...favoriteRecipes])
      );
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const tokenData = await AsyncStorage.getItem("token");
      if (!tokenData) throw new Error("No token found");

      const { token } = JSON.parse(tokenData);
      const response = await fetch("http://10.234.183.73:8000/api/recipes", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const { data } = await response.json();
      setRecipes(data);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (recipeId) => {
    try {
      const tokenData = await AsyncStorage.getItem("token");
      if (!tokenData) throw new Error("No token found");

      const { token } = JSON.parse(tokenData);

      const response = await fetch(`http://10.234.183.73:8000/api/recipes/${recipeId}/favorite`, {
        method: "PUT", // Menggunakan PUT untuk memperbarui status favorit
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isFavorite: !favoriteRecipes.has(recipeId), // Toggle status favorit
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }

      // Perbarui status favorit lokal setelah berhasil diubah
      setFavoriteRecipes((prevFavorites) => {
        const updatedFavorites = new Set(prevFavorites);
        if (updatedFavorites.has(recipeId)) {
          updatedFavorites.delete(recipeId);
        } else {
          updatedFavorites.add(recipeId);
        }
        return updatedFavorites;
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const renderItem = ({ item }) => {
    const recipeId = item._id.$oid || item._id;
    const isFavorite = favoriteRecipes.has(recipeId);

    return (
      <View style={styles.recipeCard}>
        <Text style={styles.recipeTitle}>{item.name}</Text>
        <Text style={styles.recipeText}>
          Ingredients:{" "}
          {Array.isArray(item.ingredients)
            ? item.ingredients.join(", ")
            : item.ingredients}
        </Text>
        <Text style={styles.recipeText}>
          Steps:{" "}
          {Array.isArray(item.steps) ? item.steps.join(", ") : item.steps}
        </Text>
        <TouchableOpacity
          onPress={() => toggleFavorite(recipeId)}
          style={styles.favoriteButton}
        >
          <Icon
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "red" : "gray"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f89700" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipes</Text>
      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.$oid || item._id}
      />
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
  recipeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: "#f89700",
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3a3a3a",
    marginBottom: 5,
  },
  recipeText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#555555",
  },
  favoriteButton: {
    alignSelf: "flex-end",
    padding: 5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
