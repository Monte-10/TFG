import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TrainingHistoryScreen = ({ navigation }) => {
  const [trainingHistory, setTrainingHistory] = useState([]);

  useEffect(() => {
    const fetchTrainingHistory = async () => {
      try {
        // Recuperar el ID del usuario logueado
        const userId = await AsyncStorage.getItem('userId');
        
        const savedFeedback = await AsyncStorage.getItem('trainingFeedback');
        const feedbackList = savedFeedback ? JSON.parse(savedFeedback) : [];
        
        // Filtrar el feedback por userId
        const userFeedbackList = feedbackList.filter(feedback => feedback.userId === userId);
        
        setTrainingHistory(userFeedbackList);
      } catch (error) {
        Alert.alert("Error", "No se pudo recuperar el historial de entrenamientos.");
      }
    };
  
    fetchTrainingHistory();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={trainingHistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('TrainingDetailsScreen', { trainingId: item.trainingId })}>
            <Text style={styles.title}>Id: {item.trainingId}</Text>
            <Text style={styles.title}>Fecha: {item.date}</Text>
            <Text>Entrenamiento: {item.name}</Text>
            <Text>Esfuerzo: {item.effortLevel}</Text>
            <Text>Notas: {item.notes}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TrainingHistoryScreen;
