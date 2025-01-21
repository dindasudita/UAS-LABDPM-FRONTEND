import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://10.234.183.73:8000/api/recipes';

export default function AddRecipeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState(null);

  const handleAddRecipe = async () => {
    try {
      // Validasi input
      if (!name || !ingredients || !steps) {
        alert('Please fill in all fields');
        return;
      }

      // Ambil token
      const tokenData = await AsyncStorage.getItem('token');
      if (!tokenData) throw new Error('No token found');
      const { token } = JSON.parse(tokenData);

      // Prepare data
      const recipeData = {
        name: name.trim(),
        ingredients: ingredients.split(',').map(item => item.trim()),
        steps: steps.split('.').map(item => item.trim()).filter(item => item.length > 0)
      };

      console.log('Sending data:', JSON.stringify(recipeData, null, 2));

      // Add recipe
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(recipeData)
      });

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to add recipe');
      }

      // Reset form
      setName('');
      setIngredients('');
      setSteps('');
      setImage(null);

      alert('Recipe added successfully!');
      navigation.navigate('Beranda');

    } catch (error) {
      console.error('Error adding recipe:', error);
      alert(error.message || 'Failed to add recipe');
    }
  };

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access camera roll is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!pickerResult.canceled && pickerResult.assets[0]) {
        setImage(pickerResult.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Recipe</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Recipe Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.inputMultiline}
          placeholder="Ingredients (separated by commas)"
          value={ingredients}
          onChangeText={setIngredients}
          multiline
          numberOfLines={3}
        />
        <TextInput
          style={styles.inputMultiline}
          placeholder="Steps (separated by periods)"
          value={steps}
          onChangeText={setSteps}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity onPress={handlePickImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Pick an Image</Text>
        </TouchableOpacity>

        {image && (
          <Image source={{ uri: image.uri }} style={styles.imagePreview} />
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleAddRecipe}>
          <Text style={styles.buttonText}>Add Recipe</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#FFF8ED',
    padding: 10,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFC3A0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  inputMultiline: {
    borderWidth: 1,
    borderColor: '#FFC3A0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#FFF',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: '#f89700',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  addButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f89700',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});