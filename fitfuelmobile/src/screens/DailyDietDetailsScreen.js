import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Button } from 'react-native-elements';

const DailyDietDetailsScreen = ({ route, navigation }) => {
  const { dailyDietId } = route.params;
  const [dailyDietDetails, setDailyDietDetails] = useState(null);
  const [mealsDetails, setMealsDetails] = useState([]);
  const [dishDetails, setDishDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://10.0.2.2:8000/nutrition/daily_diets/${dailyDietId}`)
      .then(response => response.json())
      .then(data => {
        setDailyDietDetails(data);
        fetchMealsDetails(data.meals);
      })
      .catch(error => {
        console.error("Error fetching DailyDiet details:", error);
        setIsLoading(false);
      });
  }, [dailyDietId]);

  const fetchMealsDetails = (mealsIds) => {
    const mealsPromises = mealsIds.map(id => 
      fetch(`http://10.0.2.2:8000/nutrition/meals/${id}`).then(res => res.json())
    );

    Promise.all(mealsPromises)
      .then(mealsData => {
        setMealsDetails(mealsData);
        const allDishIds = mealsData.flatMap(meal => meal.dishes);
        fetchDishDetails(allDishIds);
      })
      .catch(error => console.error("Error fetching meals details:", error));
  };

  const fetchDishDetails = (dishIds) => {
    const dishPromises = dishIds.map(id =>
      fetch(`http://10.0.2.2:8000/nutrition/dishes/${id}`).then(res => res.json())
    );

    Promise.all(dishPromises)
      .then(dishData => {
        setDishDetails(dishData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching dish details:", error);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <Text>Cargando detalles de la dieta y comidas...</Text>;
  }

  return (
    <ScrollView>
      {mealsDetails.map((meal, index) => (
        <View key={index}>
          <Text>Comida: {meal.name}</Text>
          {meal.dishes && meal.dishes.map((dishId, dishIndex) => {
            const dishObject = dishDetails.find(dish => dish.id === dishId);
            return dishObject ? (
              <View key={dishIndex}>
                <Text>Plato: {dishObject.name}</Text>
                <Button
                  title="Ver detalles del plato"
                  onPress={() => navigation.navigate('DishDetailsScreen', { dishId: dishObject.id })}
                />
              </View>
            ) : null;
          })}
          {/* Información nutricional de la comida */}
          <View>
            <Text>Información Nutricional:</Text>
            <Text>Calorías: {meal.calories}</Text>
            <Text>Proteínas: {meal.protein}g</Text>
            <Text>Carbohidratos: {meal.carbohydrates}g</Text>
            <Text>Azúcares: {meal.sugar}g</Text>
            <Text>Fibra: {meal.fiber}g</Text>
            <Text>Grasas: {meal.fat}g</Text>
            <Text>Grasas saturadas: {meal.saturated_fat}g</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

export default DailyDietDetailsScreen;
