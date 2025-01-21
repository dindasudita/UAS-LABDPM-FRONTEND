import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";

export default function FavoritesScreen({ route, navigation }) {
  const { favoriteRecipes = [] } = route.params || {}; // Pastikan route.params tidak null dan ada, jika tidak set array kosong

  const renderItem = ({ item }) => (
    <View style={styles.recipeCard}>
      <Text style={styles.recipeTitle}>{item.name}</Text>
      <Text style={styles.recipeText}>
        Ingredients:{" "}
        {Array.isArray(item.ingredients) ? item.ingredients.join(", ") : item.ingredients}
      </Text>
      <Text style={styles.recipeText}>
        Steps:{" "}
        {Array.isArray(item.steps) ? item.steps.join(", ") : item.steps}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Recipes</Text>
      {favoriteRecipes.length > 0 ? (
        <FlatList
          data={favoriteRecipes}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.$oid || item._id} // Pastikan ID diakses dengan benar
        />
      ) : (
        <Text style={styles.noFavorites}>No favorite recipes yet</Text>
      )}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
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
  noFavorites: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  backButton: {
    backgroundColor: "#f48a75",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
