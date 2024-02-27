import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const DetailsScreen = ({ route }) => {
  const { date, dietEvents, trainingEvents } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalles del Día: {date}</Text>
      
      {/* Entrenamientos */}
      <Text style={styles.subtitle}>Entrenamientos:</Text>
      {trainingEvents && trainingEvents.length > 0 ? (
        trainingEvents.map((training, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{training.name}</Text>
            {training.exercises_details.map((detail, idx) => (
              <Text key={idx} style={styles.itemText}>
                {detail.exercise.name} - Series: {detail.sets}, Repeticiones: {detail.repetitions}
                {detail.weight && `, Peso: ${detail.weight}kg`}
                {detail.time && `, Tiempo: ${detail.time}min`}
              </Text>
            ))}
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No hay entrenamientos para este día.</Text>
      )}
  
      {/* Dietas y Comidas */}
      <Text style={styles.subtitle}>Detalles de la Dieta Diaria:</Text>
      {dietEvents && dietEvents.length > 0 ? (
        dietEvents.map((diet, index) => (
          <View key={index} style={styles.section}>
            {/* Mostrar detalles nutricionales como antes */}
            <Text style={styles.sectionTitle}>Nutrientes:</Text>
            <Text style={styles.itemText}>Calorías: {diet.calories}</Text>
            <Text style={styles.itemText}>Proteínas: {diet.protein}g</Text>
            <Text style={styles.itemText}>Carbohidratos: {diet.carbohydrates}g</Text>
            <Text style={styles.itemText}>Azúcares: {diet.sugar}g</Text>
            <Text style={styles.itemText}>Fibra: {diet.fiber}g</Text>
            <Text style={styles.itemText}>Grasas: {diet.fat}g</Text>
            <Text style={styles.itemText}>Grasas Saturadas: {diet.saturated_fat}g</Text>
            {/* Mostrar nombres de las comidas */}
            <Text style={styles.sectionTitle}>Comidas:</Text>
            {diet.mealsDetails && diet.mealsDetails.length > 0 ? (
              diet.mealsDetails.map((meal, mealIndex) => (
                <Text key={mealIndex} style={styles.itemText}>{meal.name}</Text> // Asumiendo que meal.name contiene el nombre de la comida
              ))
            ) : (
              <Text style={styles.noDataText}>No hay detalles de comidas disponibles.</Text>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No hay dieta asignada para este día.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    marginVertical: 2,
  },
  noDataText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default DetailsScreen;
