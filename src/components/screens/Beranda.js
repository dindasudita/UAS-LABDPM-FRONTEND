import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Modal
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'http://10.234.235.4:3000/api/todos';

export default function BerandaScreen() {
  const [todos, setTodos] = useState([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); 
  const [selectedTask, setSelectedTask] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });

  const fetchTodos = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (!storedToken) {
        return;
      }

      let tokenData;
      try {
        tokenData = JSON.parse(storedToken);
      } catch (e) {
        console.error('Error parsing token:', e);
        return;
      }

      if (!tokenData.token) {
        return;
      }

      setToken(tokenData.token);
      
      const response = await fetch(API_URL, {
        headers: { 
          Authorization: `Bearer ${tokenData.token}`,
          'Cache-Control': 'no-cache'
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setTodos(data.data || []);
      
  
      const completedTasks = (data.data || []).filter(todo => todo.completed).length;
      setStats({
        total: data.data.length,
        completed: completedTasks,
        pending: data.data.length - completedTasks
      });
    } catch (error) {
      console.error('Error fetching todos:', error);
      if (!loading) {
        alert('Error fetching todos. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTodos();
    }, [])
  );

  const handleMarkAsDone = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: true }),
      });

      if (response.ok) {
        setTodos((prev) =>
          prev.map((todo) =>
            todo._id === id ? { ...todo, completed: true } : todo
          )
        );
        setStats(prev => ({
          ...prev,
          completed: prev.completed + 1,
          pending: prev.pending - 1
        }));
      } else {
        throw new Error('Failed to update todo');
      }
    } catch (error) {
      console.error('Error marking todo as done:', error);
      alert('Error updating todo. Please try again.');
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchTodos();
  }, []);

  const filteredTodos = React.useMemo(() => {
    switch (filter) {
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'pending':
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f89700" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <Text style={styles.header}>myToDo Dashboard</Text>
        
        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: '#f89700' }]}
            onPress={() => setFilter('all')}
          >
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: '#4CAF50' }]}
            onPress={() => setFilter('completed')}
          >
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: '#FF5722' }]}
            onPress={() => setFilter('pending')}
          >
            <Text style={styles.statNumber}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </TouchableOpacity>
        </View>

        {filteredTodos.map((todo) => (
          <TouchableOpacity 
            style={[styles.card, todo.completed && styles.completedCard]} 
            key={todo._id}
            onPress={() => setSelectedTask(todo)}
          >
            <View style={styles.cardContent}>
              <Text style={[styles.title, todo.completed && styles.completedTitle]}>
                {todo.title}
              </Text>
              <View style={styles.statusContainer}>
                {todo.completed ? (
                  <Icon name="checkmark-circle" size={24} color="#4CAF50" />
                ) : (
                  <TouchableOpacity onPress={() => handleMarkAsDone(todo._id)}>
                    <Icon name="time-outline" size={24} color="#FF5722" />
                  </TouchableOpacity>
                )}
                <Text style={[
                  styles.statusText,
                  { color: todo.completed ? '#4CAF50' : '#FF5722' }
                ]}>
                  {todo.completed ? "Done" : "It's not done yet."}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <Modal
          animationType="slide"
          transparent={true}
          visible={selectedTask !== null}
          onRequestClose={() => setSelectedTask(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Info ToDo</Text>
                <TouchableOpacity onPress={() => setSelectedTask(null)}>
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              {selectedTask && (
                <View style={styles.modalBody}>
                  <Text style={styles.detailLabel}>Title</Text>
                  <Text style={styles.detailText}>{selectedTask.title}</Text>
                  
                  <Text style={styles.detailLabel}>Description</Text>
                  <Text style={styles.detailText}>
                    {selectedTask.description || 'No description provided'}
                  </Text>
                  
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text style={[
                    styles.detailText,
                    { color: selectedTask.completed ? '#4CAF50' : '#FF5722' }
                  ]}>
                    {selectedTask.completed ? 'Completed' : 'Pending'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#FFF8ED",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FFF8ED",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#3B0918",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    margin: 5,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    marginTop: 4,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#f89700",
    marginBottom: 12,
  },
  completedCard: {
    borderLeftColor: "#4CAF50",
    opacity: 0.8,
  },
  cardContent: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
    marginBottom: 5,
  },
  detailText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
  },
});