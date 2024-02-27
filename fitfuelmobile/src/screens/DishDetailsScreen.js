import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Button } from 'react-native-elements';

const DishDetailsScreen = ({ route, navigation }) => {
  const { dishId } = route.params;
  const [dishDetails, setDishDetails] = useState(null);
  const [ingredientsDetails, setIngredientsDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://10.0.2.2:8000/nutrition/dishes/${dishId}`)
      .then(response => response.json())
      .then(data => {
        setDishDetails(data);
        const ingredientIds = data.ingredients_details.map(item => item.ingredient);
        fetchIngredientsDetails(ingredientIds);
      })
      .catch(error => {
        console.error("Error fetching dish details:", error);
        setIsLoading(false);
      });
  }, [dishId]);

  const fetchIngredientsDetails = (ingredientIds) => {
    const ingredientsPromises = ingredientIds.map(id => 
      fetch(`http://10.0.2.2:8000/nutrition/ingredients/${id}`).then(res => res.json())
    );

    Promise.all(ingredientsPromises)
      .then(ingredientsData => {
        setIngredientsDetails(ingredientsData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching ingredients details:", error);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <Text>Cargando detalles del plato e ingredientes...</Text>;
  }

  return (
    <ScrollView>
      <View>
        <Text>Plato: {dishDetails.name}</Text>
        {ingredientsDetails.map((ingredient, index) => (
          <View key={index}>
            <Text>Ingrediente: {ingredient.name} - Cantidad: {dishDetails.ingredients_details.find(i => i.ingredient === ingredient.id)?.quantity}</Text>
            <Button
              title="Ver detalles del ingrediente"
              onPress={() => navigation.navigate('IngredientDetailsScreen', { ingredientId: ingredient.id })}
            />
          </View>
        ))}
        {/* Información nutricional del plato */}
        <View>
          <Text>Información Nutricional:</Text>
          <Text>Calorías: {dishDetails.calories}</Text>
          <Text>Proteínas: {dishDetails.protein}g</Text>
          <Text>Carbohidratos: {dishDetails.carbohydrates}g</Text>
          <Text>Grasas: {dishDetails.fat}g</Text>
          <Text>Fibras: {dishDetails.fiber}g</Text>
          <Text>Azúcares: {dishDetails.sugar}g</Text>
        </View>
      </View>
    </ScrollView>
  );
}

export default DishDetailsScreen;
