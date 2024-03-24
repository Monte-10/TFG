import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ManageDailyDiet() {
  const { dietId } = useParams();
  const [dailyDiets, setDailyDiets] = useState([]);
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState({});
  const [nutritionTotals, setNutritionTotals] = useState({}); // Almacenará los totales nutricionales por fecha

  useEffect(() => {
    // Cargar los DailyDiets para la Dieta actual y las comidas disponibles
    const fetchDailyDiets = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/nutrition/diet/${dietId}/`);
        if (!response.ok) throw new Error('DailyDiets fetch failed');
        const data = await response.json();
        setDailyDiets(data.daily_diets || []);
        // Inicializar selectedMeals con los meals existentes para cada DailyDiet
        const mealsSelection = {};
        data.daily_diets.forEach(dd => {
          mealsSelection[dd.date] = dd.meals.map(m => m.id);
        });
        setSelectedMeals(mealsSelection);
      } catch (error) {
        console.error('Error loading daily diets:', error);
      }
    };

    const fetchMeals = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/nutrition/meals/');
        if (!response.ok) throw new Error('Meals fetch failed');
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error('Error loading meals:', error);
      }
    };

    fetchDailyDiets();
    fetchMeals();
  }, [dietId]);

  useEffect(() => {
    // Función para calcular los totales nutricionales
    const calculateNutritionTotals = () => {
      const totals = {};
      Object.entries(selectedMeals).forEach(([date, mealIds]) => {
        totals[date] = mealIds.reduce((acc, mealId) => {
          const meal = meals.find(m => m.id === mealId);
          if (meal) {
            
            acc.calories += meal.calories;
            acc.protein += meal.protein;
            acc.carbohydrates += meal.carbohydrates;
            acc.fat += meal.fat;
            acc.sugar += meal.sugar;
            acc.fiber += meal.fiber;
            acc.saturated_fat += meal.saturated_fat;
            acc.gluten_free = acc.gluten_free && meal.gluten_free;
            acc.lactose_free = acc.lactose_free && meal.lactose_free;
            acc.vegan = acc.vegan && meal.vegan;
            acc.vegetarian = acc.vegetarian && meal.vegetarian;
            acc.pescetarian = acc.pescetarian && meal.pescetarian;
            acc.contains_meat = acc.contains_meat || meal.contains_meat;
            acc.contains_vegetables = acc.contains_vegetables || meal.contains_vegetables;
            acc.contains_fish_shellfish_canned_preserved = acc.contains_fish_shellfish_canned_preserved || meal.contains_fish_shellfish_canned_preserved;
            acc.cereal = acc.cereal || meal.cereal;
            acc.pasta_or_rice = acc.pasta_or_rice || meal.pasta_or_rice;
            acc.dairy_yogurt_cheese = acc.dairy_yogurt_cheese || meal.dairy_yogurt_cheese;
            acc.fruit = acc.fruit || meal.fruit;
            acc.nuts = acc.nuts || meal.nuts;
            acc.legume = acc.legume || meal.legume;
            acc.sauce_or_condiment = acc.sauce_or_condiment || meal.sauce_or_condiment;
            acc.deli_meat = acc.deli_meat || meal.deli_meat;
            acc.bread_or_toast = acc.bread_or_toast || meal.bread_or_toast;
            acc.egg = acc.egg || meal.egg;
            acc.special_drink_or_supplement = acc.special_drink_or_supplement || meal.special_drink_or_supplement;
            acc.tuber = acc.tuber || meal.tuber;
            acc.other = acc.other || meal.other;
          }
          return acc;
        }, { calories: 0,
            protein: 0,
            carbohydrates: 0,
            fat: 0,
            sugar: 0,
            fiber: 0,
            saturated_fat: 0,
            gluten_free: true,
            lactose_free: true,
            vegan: true,
            vegetarian: true,
            pescetarian: true,
            contains_meat: false,
            contains_vegetables: false,
            contains_fish_shellfish_canned_preserved: false,
            cereal: false,
            pasta_or_rice: false,
            dairy_yogurt_cheese: false,
            fruit: false,
            nuts: false,
            legume: false,
            sauce_or_condiment: false,
            deli_meat: false,
            bread_or_toast: false,
            egg: false,
            special_drink_or_supplement: false,
            tuber: false,
            other: false });
      });
      setNutritionTotals(totals);
    };

    calculateNutritionTotals();
  }, [selectedMeals, meals]);

  const handleMealSelection = (mealId, date) => {
    setSelectedMeals(prevSelectedMeals => {
      const newSelectedMeals = { ...prevSelectedMeals };
      if (newSelectedMeals[date]?.includes(mealId)) {
        newSelectedMeals[date] = newSelectedMeals[date].filter(id => id !== mealId);
      } else {
        newSelectedMeals[date] = [...(newSelectedMeals[date] || []), mealId];
      }
      return newSelectedMeals;
    });
  };

  const saveDailyDietMeals = async (date) => {
    try {
      const dailyDietId = dailyDiets.find(dd => dd.date === date).id;
      const mealsToSave = selectedMeals[date];
      console.log('Saving meals:', mealsToSave);
      const response = await fetch(`http://127.0.0.1:8000/nutrition/daily_diets/${dailyDietId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meals: mealsToSave }),
      });
      if (!response.ok) throw new Error('Saving meals failed');
      alert('Meals updated successfully!');
    } catch (error) {
      console.error('Error saving meals:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Administrar Dieta Diaria para la Dieta ID: {dietId}</h2>
      {dailyDiets.map(dailyDiet => (
        <div key={dailyDiet.id} className="card my-3">
          <div className="card-body">
            <h5 className="card-title">Dieta Diaria para la Fecha: {dailyDiet.date}</h5>
            <div>
              {meals.map(meal => (
                <div key={meal.id} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedMeals[dailyDiet.date]?.includes(meal.id)}
                    onChange={() => handleMealSelection(meal.id, dailyDiet.date)}
                    id={`meal-${meal.id}`}
                  />
                  <label className="form-check-label" htmlFor={`meal-${meal.id}`}>
                    {meal.name}
                  </label>
                </div>
              ))}
              <button className="btn btn-primary mt-2" onClick={() => saveDailyDietMeals(dailyDiet.date)}>Guardar Comidas para {dailyDiet.date}</button>
            </div>
            <div className="nutrition-summary mt-3">
              <h6>Resumen Nutricional:</h6>
              <p>Calorías: {nutritionTotals[dailyDiet.date]?.calories || 0}</p>
              <p>Proteínas: {nutritionTotals[dailyDiet.date]?.protein || 0}g</p>
              <p>Carbohidratos: {nutritionTotals[dailyDiet.date]?.carbohydrates || 0}g</p>
                <p>Grasas: {nutritionTotals[dailyDiet.date]?.fat || 0}g</p>
                <p>Azúcar: {nutritionTotals[dailyDiet.date]?.sugar || 0}g</p>
                <p>Fibra: {nutritionTotals[dailyDiet.date]?.fiber || 0}g</p>
                <p>Grasas Saturadas: {nutritionTotals[dailyDiet.date]?.saturated_fat || 0}g</p>
                <p>Libre de Gluten: {nutritionTotals[dailyDiet.date]?.gluten_free ? 'Sí' : 'No'}</p>
                <p>Libre de Lactosa: {nutritionTotals[dailyDiet.date]?.lactose_free ? 'Sí' : 'No'}</p>
                <p>Vegano: {nutritionTotals[dailyDiet.date]?.vegan ? 'Sí' : 'No'}</p>
                <p>Vegetariano: {nutritionTotals[dailyDiet.date]?.vegetarian ? 'Sí' : 'No'}</p>
                <p>Pescetariano: {nutritionTotals[dailyDiet.date]?.pescetarian ? 'Sí' : 'No'}</p>
                <p>Contiene Carne: {nutritionTotals[dailyDiet.date]?.contains_meat ? 'Sí' : 'No'}</p>
                <p>Contiene Vegetales: {nutritionTotals[dailyDiet.date]?.contains_vegetables ? 'Sí' : 'No'}</p>
                <p>Contiene Pescado/Mariscos/Enlatados/Conservas: {nutritionTotals[dailyDiet.date]?.contains_fish_shellfish_canned_preserved ? 'Sí' : 'No'}</p>
                <p>Cereal: {nutritionTotals[dailyDiet.date]?.cereal ? 'Sí' : 'No'}</p>
                <p>Pasta o Arroz: {nutritionTotals[dailyDiet.date]?.pasta_or_rice ? 'Sí' : 'No'}</p>
                <p>Lácteos/Yogur/Queso: {nutritionTotals[dailyDiet.date]?.dairy_yogurt_cheese ? 'Sí' : 'No'}</p>
                <p>Fruta: {nutritionTotals[dailyDiet.date]?.fruit ? 'Sí' : 'No'}</p>
                <p>Nueces: {nutritionTotals[dailyDiet.date]?.nuts ? 'Sí' : 'No'}</p>
                <p>Legumbre: {nutritionTotals[dailyDiet.date]?.legume ? 'Sí' : 'No'}</p>
                <p>Salsa o Condimento: {nutritionTotals[dailyDiet.date]?.sauce_or_condiment ? 'Sí' : 'No'}</p>
                <p>Embutido: {nutritionTotals[dailyDiet.date]?.deli_meat ? 'Sí' : 'No'}</p>
                <p>Pan o Tostada: {nutritionTotals[dailyDiet.date]?.bread_or_toast ? 'Sí' : 'No'}</p>
                <p>Huevo: {nutritionTotals[dailyDiet.date]?.egg ? 'Sí' : 'No'}</p>
                <p>Bebida Especial o Suplemento: {nutritionTotals[dailyDiet.date]?.special_drink_or_supplement ? 'Sí' : 'No'}</p>
                <p>Tubérculo: {nutritionTotals[dailyDiet.date]?.tuber ? 'Sí' : 'No'}</p>
                <p>Otro: {nutritionTotals[dailyDiet.date]?.other ? 'Sí' : 'No'}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ManageDailyDiet;
