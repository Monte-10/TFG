import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const TodayScreen = ({ navigation }) => {
  const [trainings, setTrainings] = useState([]);
  const [dailyDiet, setDailyDiet] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const authToken = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');
      const today = new Date().toISOString().split('T')[0];
  
      // Fetch Training
      fetch(`http://10.0.2.2:8000/sport/trainings/today?date=${today}&user=${userId}`, {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.detail) {
          console.log("Training detail error:", data.detail);
          setTrainings([]);
        } else {
          setTrainings(data);
        }
      })
      .catch(error => console.error("Training fetch error:", error));
  
      // Fetch DailyDiet
      fetch(`http://10.0.2.2:8000/nutrition/dailydiets/today?date=${today}&user=${userId}`, {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.detail) {
          console.log("DailyDiet detail error:", data.detail);
          setDailyDiet(null);
        } else {
          setDailyDiet(data);
        }
      })
      .catch(error => console.error("DailyDiet fetch error:", error));
    };
  
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Entrenamientos de Hoy</Text>
      {trainings.map((training, index) => (
        <View key={index} style={styles.item}>
          <Text>{training.name}</Text>
          <Button
            title="Ver Detalles"
            onPress={() => navigation.navigate('TrainingDetailsScreen', { trainingId: training.id })}
          />
        </View>
      ))}
      <Text style={styles.title}>Dieta de Hoy</Text>
      {dailyDiet ? (
        <View style={styles.item}>
          <Text>Haz click para ver tus comidas para hoy</Text>
          <Button
            title="Ver Comidas del Día"
            onPress={() => {
                if (dailyDiet && dailyDiet.length > 0) {
                // Asumiendo que siempre quieres el primer objeto de la lista
                const dietId = dailyDiet[0].id;
                navigation.navigate('DailyDietDetailsScreen', { dailyDietId: dietId });
                } else {
                console.log('No hay dieta diaria disponible.');
                }
            }}
            />
        </View>
      ) : (
        <Text>No hay dieta asignada para hoy.</Text>
      )}
    </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
  },
  item: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#eaeaea',
  },
});

export default TodayScreen;
