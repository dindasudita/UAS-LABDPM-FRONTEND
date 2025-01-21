import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://10.234.237.249:8000/api/recipes'; 

export default function AddRecipeScreen() {
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState(null);
  const [token, setToken] = useState('');
  const [editRecipeId, setEditRecipeId] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        const { token } = JSON.parse(storedToken);
        setToken(token);
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        console.log("Fetched Data:", data); // Log fetched data to verify its contents
        if (data && data.data) {
          setRecipes(data.data); // Make sure only recipe data is being set
        }
      }
    };
    fetchRecipes();
  }, []);

  const handleAddRecipe = async () => {
    let imageUrl = null;
    if (image) {
      // Upload image to server
      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        name: 'recipe.jpg',
        type: 'image/jpeg',
      });

      const imageResponse = await fetch('http://10.234.237.249:8000/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const imageData = await imageResponse.json();
      imageUrl = imageData.url; // Ambil URL gambar yang di-upload
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, ingredients, steps, imageUrl }),
    });

    const result = await response.json();

    if (response.ok) {
      setRecipes((prev) => [result.data, ...prev]);
      setTitle('');
      setIngredients('');
      setSteps('');
      setImage(null);
    } else {
      alert(result.message || 'Error adding recipe');
    }
  };

  const handleEditRecipe = async () => {
    let imageUrl = null;
    if (image) {
      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        name: 'recipe.jpg',
        type: 'image/jpeg',
      });

      const imageResponse = await fetch('http://10.234.237.249:8000/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const imageData = await imageResponse.json();
      imageUrl = imageData.url;
    }

    const response = await fetch(`${API_URL}/${editRecipeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, ingredients, steps, imageUrl }),
    });

    const result = await response.json();

    if (response.ok) {
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe._id === editRecipeId ? { ...recipe, title, ingredients, steps, imageUrl } : recipe
        )
      );
      setTitle('');
      setIngredients('');
      setSteps('');
      setImage(null);
      setEditRecipeId(null);
    } else {
      alert(result.message || 'Error editing recipe');
    }
  };

  const handleDeleteRecipe = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
    } else {
      alert('Error deleting recipe');
    }
  };

  const handlePickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Recipe</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Recipe Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Ingredients"
          value={ingredients}
          onChangeText={setIngredients}
        />
        <TextInput
          style={styles.input}
          placeholder="Steps"
          value={steps}
          onChangeText={setSteps}
        />

        <TouchableOpacity onPress={handlePickImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Pick an Image</Text>
        </TouchableOpacity>

        {image && (
          <Image source={{ uri: image.uri }} style={styles.imagePreview} />
        )}

        <View style={styles.buttonContainer}>
          {editRecipeId ? (
            <>
              <TouchableOpacity style={styles.updateButton} onPress={handleEditRecipe}>
                <Text style={styles.buttonText}>Update Recipe</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.updateButton} onPress={handleAddRecipe}>
              <Text style={styles.buttonText}>Add Recipe</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.recipeItem}>
            <View>
              <Text style={styles.recipeTitle}>{item.title}</Text>
              <Text>{item.ingredients}</Text>
              <Text>{item.steps}</Text>
              {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />}
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => {
                  setEditRecipeId(item._id);
                  setTitle(item.title);
                  setIngredients(item.ingredients);
                  setSteps(item.steps);
                  setImage(item.imageUrl ? { uri: item.imageUrl } : null);
                }}
              >
                <Icon name="create" size={20} color="#2464EC" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteRecipe(item._id)}>
                <Icon name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF8ED',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#3B0918',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
    backgroundColor: '#FFF8ED',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFC3A0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  imageButton: {
    backgroundColor: '#f89700',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  updateButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f89700',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#FDE4D0',
    elevation: 2,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B0918',
  },
  recipeImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
