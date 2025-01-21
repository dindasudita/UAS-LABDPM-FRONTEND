import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button, FlatList, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BerandaScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const tokenData = await AsyncStorage.getItem("token");
        if (!tokenData) throw new Error("No token found");

        const { token } = JSON.parse(tokenData);
        const response = await fetch("http://10.234.237.249:8000/api/recipes", {
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

    fetchRecipes();
  }, []);

  const handleFavorite = (recipeId) => {
    setFavorites((prevFavorites) => {
      // Check if the recipe is already in favorites
      if (prevFavorites.includes(recipeId)) {
        // If it is, remove it
        return prevFavorites.filter((id) => id !== recipeId);
      } else {
        // If it's not, add it
        return [...prevFavorites, recipeId];
      }
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.recipeCard}>
      <Text style={styles.recipeTitle}>{item.name}</Text>
      <Text style={styles.recipeText}>Ingredients: {item.ingredients.join(", ")}</Text>
      <Text style={styles.recipeText}>Steps: {item.steps.join(", ")}</Text>
      {item.image && <Image source={{ uri: item.image }} style={styles.recipeImage} />}
      <Button
        title={favorites.includes(item._id.$oid) ? "Remove from Favorites" : "Add to Favorites"}
        onPress={() => handleFavorite(item._id.$oid)}
        color="#f48a75"
      />
    </View>
  );

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
        keyExtractor={(item) => item._id.$oid}
      />
      <Button
        title="View Favorites"
        onPress={() => navigation.navigate("Favorites", { favorites, recipes })}
        color="#f48a75"
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
  recipeImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
