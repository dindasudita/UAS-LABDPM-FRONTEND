import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.234.235.4:3000/api/todos';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [token, setToken] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [headerText, setHeaderText] = useState('My Todos');
  useEffect(() => {
    const fetchTodos = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        const { token } = JSON.parse(storedToken);
        setToken(token);
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setTodos(data.data || []);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    const result = await response.json();

    if (response.ok) {
      setTodos((prev) => [result.data, ...prev]);
      setTitle('');
      setDescription('');
      setShowForm(false);
    } else {
      alert(result.message || 'Error adding todo');
    }
  };

  const handleEditTodo = async () => {
    const response = await fetch(`${API_URL}/${editTodoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    const result = await response.json();

    if (response.ok) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === editTodoId ? { ...todo, title, description } : todo
        )
      );
      setTitle('');
      setDescription('');
      setShowForm(false);
      setEditTodoId(null);
      setHeaderText('My Todos');
    } else {
      alert(result.message || 'Error editing todo');
    }
  };

  const handleDeleteTodo = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } else {
      alert('Error deleting todo');
    }
  };

  const handleCancelEdit = () => {
    setTitle('');
    setDescription('');
    setShowForm(false);
    setEditTodoId(null);
    setHeaderText('My Todos'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{headerText}</Text>

      {showForm ? (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <View style={styles.buttonContainer}>
            {editTodoId ? (
              <>
                <TouchableOpacity style={styles.updateButton} onPress={handleEditTodo}>
                  <Text style={styles.buttonText}>Update Todo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.updateButton} onPress={handleAddTodo}>
                <Text style={styles.buttonText}>Add Todo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <>
          <FlatList
            data={todos}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.todoItem}>
                <View>
                  <Text style={styles.todoTitle}>{item.title}</Text>
                  <Text>{item.description}</Text>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditTodoId(item._id);
                      setTitle(item.title);
                      setDescription(item.description);
                      setShowForm(true);
                      setHeaderText('ToDo Details');
                    }}
                  >
                    <Icon name="create" size={20} color="#2464EC" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteTodo(item._id)}>
                    <Icon name="trash" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowForm(true)}
          >
            <Icon name="add" size={30} color="white" />
          </TouchableOpacity>
        </>
      )}
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
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#FDE4D0',
    elevation: 2,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B0918',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#f89700',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  actionIcon: {
    marginHorizontal: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#F7B270',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  updateButton: {
    flex: 1,
    marginRight: 5,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f89700',
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    marginLeft: 5,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFB3A0',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
