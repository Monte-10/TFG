import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';

const FoodDetailsScreen = ({ route }) => {
  const { foodId } = route.params;
  const [foodDetails, setFoodDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://10.0.2.2:8000/nutrition/foods/${foodId}`)
      .then((response) => response.json())
      .then((data) => {
        setFoodDetails(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching food details:", error);
        setIsLoading(false);
      });
  }, [foodId]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{foodDetails.name}</Text>
      <Text>Unidad de peso: {foodDetails.unit_weight}g</Text>
      <Text>Calorías: {foodDetails.calories} kcal</Text>
      <Text>Proteínas: {foodDetails.protein}g</Text>
      <Text>Carbohidratos: {foodDetails.carbohydrates}g</Text>
      <Text>Azúcar: {foodDetails.sugar}g</Text>
      <Text>Fibra: {foodDetails.fiber}g</Text>
      <Text>Grasas: {foodDetails.fat}g</Text>
      <Text>Grasas saturadas: {foodDetails.saturated_fat}g</Text>
      {/* Añade aquí más detalles de la Food si lo deseas */}
      {/* Mostrar valores booleanos como Sí/No */}
      <Text>Libre de gluten: {foodDetails.gluten_free ? 'Sí' : 'No'}</Text>
      <Text>Libre de lactosa: {foodDetails.lactose_free ? 'Sí' : 'No'}</Text>
      {/* Continúa con el resto de las propiedades booleanas */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  // Añade más estilos si lo necesitas
});

export default FoodDetailsScreen;
