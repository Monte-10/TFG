import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';

const IngredientDetailsScreen = ({ route, navigation }) => {
  const { ingredientId } = route.params;
  const [ingredientDetails, setIngredientDetails] = useState(null);
  const [foodDetails, setFoodDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://10.0.2.2:8000/nutrition/ingredients/${ingredientId}`)
      .then((response) => response.json())
      .then((data) => {
        setIngredientDetails(data);
        return fetch(`http://10.0.2.2:8000/nutrition/foods/${data.food}`);
      })
      .then((response) => response.json())
      .then((foodData) => {
        setFoodDetails(foodData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching ingredient or food details:", error);
        setIsLoading(false);
      });
  }, [ingredientId]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ingredientDetails.name}</Text>
      {/* Información del ingrediente */}
      <Text>Calorías: {ingredientDetails.calories} kcal</Text>
      <Text>Proteínas: {ingredientDetails.protein} g</Text>
      <Text>Carbohidratos: {ingredientDetails.carbohydrates} g</Text>
      <Text>Azúcares: {ingredientDetails.sugar} g</Text>
      <Text>Fibra: {ingredientDetails.fiber} g</Text>
      <Text>Grasas: {ingredientDetails.fat} g</Text>
      <Text>Grasas saturadas: {ingredientDetails.saturated_fat} g</Text>
      
      {/* Información resumida de la Food asociada */}
      {foodDetails && (
        <View>
          <Text style={styles.subtitle}>Detalles de la Food:</Text>
          <Text>Nombre: {foodDetails.name}</Text>
          <Button onPress={() => navigation.navigate('FoodDetailsScreen', { foodId: foodDetails.id })} title="Ver detalles de la Food" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
});

export default IngredientDetailsScreen;
