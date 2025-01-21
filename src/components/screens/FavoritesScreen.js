import React from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";

export default function FavoritesScreen({ route, navigation }) {
  const { favorites, recipes } = route.params;

  // Filter recipes to show only the ones that are in favorites
  const favoriteRecipes = recipes.filter((recipe) =>
    favorites.includes(recipe._id.$oid)
  );

  const renderItem = ({ item }) => (
    <View style={styles.recipeCard}>
      <Text style={styles.recipeTitle}>{item.name}</Text>
      <Text style={styles.recipeText}>Ingredients: {item.ingredients.join(", ")}</Text>
      <Text style={styles.recipeText}>Steps: {item.steps.join(", ")}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Recipes</Text>
      {favoriteRecipes.length > 0 ? (
        <FlatList
          data={favoriteRecipes}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.$oid}
        />
      ) : (
        <Text>No favorite recipes yet</Text>
      )}
      <Button title="Back to Home" onPress={() => navigation.goBack()} color="#f48a75" />
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
});
