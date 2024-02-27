import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalendarScreen = ({ navigation }) => {
  const [markedDates, setMarkedDates] = useState({});

  // Función para obtener eventos de DailyDiet
  const fetchDietEvents = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/nutrition/daily_diets');
      if (!response.ok) throw new Error('Network response was not ok');
      const diets = await response.json();
      return diets.map(diet => ({
        date: diet.date, // Asume este campo existe y está en formato 'YYYY-MM-DD'
        type: 'diet'
      }));
    } catch (error) {
      console.error('Error fetching diet events:', error);
      return [];
    }
  };

  // Función para obtener eventos de Training
  const fetchTrainingEvents = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/sport/trainings');
      if (!response.ok) throw new Error('Network response was not ok');
      const trainings = await response.json();
      return trainings.map(training => ({
        date: training.date, // Asume este campo existe y está en formato 'YYYY-MM-DD'
        type: 'training'
      }));
    } catch (error) {
      console.error('Error fetching training events:', error);
      return [];
    }
  };

  const handleDayPress = async (day) => {
    console.log('selected day', day.dateString);
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');

      // Token de autenticación esté presente
      if (!authToken) {
        console.error('AuthToken not found');
        return;
      }
      
      const dietResponse = await fetch(`http://10.0.2.2:8000/nutrition/dailydiets/date/${day.dateString}?user=${userId}`, {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      });

      const trainingResponse = await fetch(`http://10.0.2.2:8000/sport/trainings/date/${day.dateString}?user=${userId}`, {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      });
      if (!dietResponse.ok || !trainingResponse.ok) {
        throw new Error('Error fetching data');
      }
  
      const dietData = await dietResponse.json();
      const trainingData = await trainingResponse.json();
  
      // Suponiendo que ambos servicios devuelven un arreglo de eventos
      // y que deseas navegar a DetailsScreen con la información de los eventos existentes
      navigation.navigate('DetailsScreen', {
        date: day.dateString,
        dietEvents: dietData.length > 0 ? dietData : null,
        trainingEvents: trainingData.length > 0 ? trainingData : null
      });
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  };


  // Combinar y marcar eventos de dieta y entrenamiento
  useEffect(() => {
    const markEvents = async () => {
      const dietEvents = await fetchDietEvents();
      const trainingEvents = await fetchTrainingEvents();
      const allEvents = [...dietEvents, ...trainingEvents];
      
      const markedDates = allEvents.reduce((acc, current) => {
        const dotColor = current.type === 'diet' ? 'blue' : 'red';
        if (!acc[current.date]) {
          acc[current.date] = { marked: true, dots: [{ color: dotColor }] };
        } else {
          acc[current.date].dots.push({ color: dotColor });
        }
        return acc;
      }, {});

      setMarkedDates(markedDates);
    };

    markEvents();
  }, []);

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        markingType={'multi-dot'}
        onDayPress={handleDayPress}
      />
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: 'blue' }]}></View>
          <Text style={styles.legendText}>Dieta</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: 'red' }]}></View>
          <Text style={styles.legendText}>Entrenamiento</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
  },
});

export default CalendarScreen;
