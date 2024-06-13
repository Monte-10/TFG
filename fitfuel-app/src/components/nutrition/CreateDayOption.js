import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreateDayOption.css';

function CreateDayOption() {
  const [name, setName] = useState('');
  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: '',
    mid_morning: '',
    lunch: '',
    snack: '',
    dinner: '',
    extras: []
  });
  const [nutritionTotals, setNutritionTotals] = useState({
    calories: 0, protein: 0, carbohydrates: 0, fat: 0, sugar: 0, fiber: 0, saturated_fat: 0,
    gluten_free: true, lactose_free: true, vegan: true, vegetarian: true, pescetarian: true,
    contains_meat: false, contains_vegetables: false, contains_fish_shellfish_canned_preserved: false,
    cereal: false, pasta_or_rice: false, dairy_yogurt_cheese: false, fruit: false, nuts: false,
    legume: false, sauce_or_condiment: false, deli_meat: false, bread_or_toast: false, egg: false,
    special_drink_or_supplement: false, tuber: false, other: false
  });
  const [meals, setMeals] = useState([]);
  const [optionCreated, setOptionCreated] = useState(false);
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/nutrition/meals/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`,
      },
    })
    .then(response => response.json())
    .then(data => setMeals(data))
    .catch(error => {
      console.error('Error fetching meals:', error);
      setError('Error al obtener comidas. Por favor, refresque la página.');
    });
  }, [apiUrl]);

  const calculateNutritionTotals = useCallback(() => {
    let newTotals = {
      calories: 0, protein: 0, carbohydrates: 0, fat: 0, sugar: 0, fiber: 0, saturated_fat: 0,
      gluten_free: true, lactose_free: true, vegan: true, vegetarian: true, pescetarian: true,
      contains_meat: false, contains_vegetables: false, contains_fish_shellfish_canned_preserved: false,
      cereal: false, pasta_or_rice: false, dairy_yogurt_cheese: false, fruit: false, nuts: false,
      legume: false, sauce_or_condiment: false, deli_meat: false, bread_or_toast: false, egg: false,
      special_drink_or_supplement: false, tuber: false, other: false
    };

    Object.values(selectedMeals).forEach(mealId => {
      if (mealId !== '') {
        const meal = meals.find(m => m.id.toString() === mealId);
        if (meal) {
          newTotals.calories += meal.calories;
          newTotals.protein += meal.protein;
          newTotals.carbohydrates += meal.carbohydrates;
          newTotals.fat += meal.fat;
          newTotals.sugar += meal.sugar;
          newTotals.fiber += meal.fiber;
          newTotals.saturated_fat += meal.saturated_fat;
          newTotals.gluten_free = newTotals.gluten_free && meal.gluten_free;
          newTotals.lactose_free = newTotals.lactose_free && meal.lactose_free;
          newTotals.vegan = newTotals.vegan && meal.vegan;
          newTotals.vegetarian = newTotals.vegetarian && meal.vegetarian;
          newTotals.pescetarian = newTotals.pescetarian && meal.pescetarian;
          newTotals.contains_meat = newTotals.contains_meat || meal.contains_meat;
          newTotals.contains_vegetables = newTotals.contains_vegetables || meal.contains_vegetables;
          newTotals.contains_fish_shellfish_canned_preserved = newTotals.contains_fish_shellfish_canned_preserved || meal.contains_fish_shellfish_canned_preserved;
          newTotals.cereal = newTotals.cereal || meal.cereal;
          newTotals.pasta_or_rice = newTotals.pasta_or_rice || meal.pasta_or_rice;
          newTotals.dairy_yogurt_cheese = newTotals.dairy_yogurt_cheese || meal.dairy_yogurt_cheese;
          newTotals.fruit = newTotals.fruit || meal.fruit;
          newTotals.nuts = newTotals.nuts || meal.nuts;
          newTotals.legume = newTotals.legume || meal.legume;
          newTotals.sauce_or_condiment = newTotals.sauce_or_condiment || meal.sauce_or_condiment;
          newTotals.deli_meat = newTotals.deli_meat || meal.deli_meat;
          newTotals.bread_or_toast = newTotals.bread_or_toast || meal.bread_or_toast;
          newTotals.egg = newTotals.egg || meal.egg;
          newTotals.special_drink_or_supplement = newTotals.special_drink_or_supplement || meal.special_drink_or_supplement;
          newTotals.tuber = newTotals.tuber || meal.tuber;
          newTotals.other = newTotals.other || meal.other;
        }
      }
    });

    selectedMeals.extras.forEach(extraId => {
      const extra = meals.find(m => m.id.toString() === extraId);
      if (extra) {
        newTotals.calories += extra.calories;
        newTotals.protein += extra.protein;
        newTotals.carbohydrates += extra.carbohydrates;
        newTotals.fat += extra.fat;
        newTotals.sugar += extra.sugar;
        newTotals.fiber += extra.fiber;
        newTotals.saturated_fat += extra.saturated_fat;
        newTotals.gluten_free = newTotals.gluten_free && extra.gluten_free;
        newTotals.lactose_free = newTotals.lactose_free && extra.lactose_free;
        newTotals.vegan = newTotals.vegan && extra.vegan;
        newTotals.vegetarian = newTotals.vegetarian && extra.vegetarian;
        newTotals.pescetarian = newTotals.pescetarian && extra.pescetarian;
        newTotals.contains_meat = newTotals.contains_meat || extra.contains_meat;
        newTotals.contains_vegetables = newTotals.contains_vegetables || extra.contains_vegetables;
        newTotals.contains_fish_shellfish_canned_preserved = newTotals.contains_fish_shellfish_canned_preserved || extra.contains_fish_shellfish_canned_preserved;
        newTotals.cereal = newTotals.cereal || extra.cereal;
        newTotals.pasta_or_rice = newTotals.pasta_or_rice || extra.pasta_or_rice;
        newTotals.dairy_yogurt_cheese = newTotals.dairy_yogurt_cheese || extra.dairy_yogurt_cheese;
        newTotals.fruit = newTotals.fruit || extra.fruit;
        newTotals.nuts = newTotals.nuts || extra.nuts;
        newTotals.legume = newTotals.legume || extra.legume;
        newTotals.sauce_or_condiment = newTotals.sauce_or_condiment || extra.sauce_or_condiment;
        newTotals.deli_meat = newTotals.deli_meat || extra.deli_meat;
        newTotals.bread_or_toast = newTotals.bread_or_toast || extra.bread_or_toast;
        newTotals.egg = newTotals.egg || extra.egg;
        newTotals.special_drink_or_supplement = newTotals.special_drink_or_supplement || extra.special_drink_or_supplement;
        newTotals.tuber = newTotals.tuber || extra.tuber;
      }
    });

    setNutritionTotals(newTotals);
  }, [meals, selectedMeals]);

  useEffect(() => {
    calculateNutritionTotals();
  }, [selectedMeals, meals, calculateNutritionTotals]);

  const handleMealChange = (mealType, value) => {
    setSelectedMeals({ ...selectedMeals, [mealType]: value });
  };

  const handleExtrasChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedMeals({ ...selectedMeals, extras: selectedOptions });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('Auth token not found');
      setError('Autenticación requerida.');
      return;
    }

    const optionData = {
      name,
      breakfast: selectedMeals.breakfast,
      mid_morning: selectedMeals.mid_morning,
      lunch: selectedMeals.lunch,
      snack: selectedMeals.snack,
      dinner: selectedMeals.dinner,
      extras: selectedMeals.extras
    };

    console.log("Enviando datos de opción diaria", optionData);

    try {
      const response = await fetch(`${apiUrl}/nutrition/dayoptions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`
        },
        body: JSON.stringify(optionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('Éxito:', data);
      toast.success('¡Opción creada exitosamente!');
      setOptionCreated(true);

    } catch (error) {
      console.error('Error creando la opción:', error);
      toast.error('Error al crear la opción. Por favor intente de nuevo.');
      setError('Error al crear la opción. Por favor intente de nuevo.');
    }
  };

  return (
    <div className="create-day-option-container mt-5">
      <h2>Crear Opción de Día</h2>
      {!optionCreated ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="optionName" className="form-label">Nombre de la Opción:</label>
            <input
              type="text"
              className="form-control"
              id="optionName"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nombre de la Opción"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="breakfastSelect" className="form-label">Desayuno:</label>
            <select
              className="form-select"
              id="breakfastSelect"
              value={selectedMeals.breakfast}
              onChange={(e) => handleMealChange('breakfast', e.target.value)}
            >
              <option value="">Seleccione Desayuno</option>
              {meals.map((meal) => (
                <option key={meal.id} value={meal.id}>{meal.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="midMorningSelect" className="form-label">Media Mañana:</label>
            <select
              className="form-select"
              id="midMorningSelect"
              value={selectedMeals.mid_morning}
              onChange={(e) => handleMealChange('mid_morning', e.target.value)}
            >
              <option value="">Seleccione Media Mañana</option>
              {meals.map((meal) => (
                <option key={meal.id} value={meal.id}>{meal.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="lunchSelect" className="form-label">Almuerzo:</label>
            <select
              className="form-select"
              id="lunchSelect"
              value={selectedMeals.lunch}
              onChange={(e) => handleMealChange('lunch', e.target.value)}
            >
              <option value="">Seleccione Almuerzo</option>
              {meals.map((meal) => (
                <option key={meal.id} value={meal.id}>{meal.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="snackSelect" className="form-label">Merienda:</label>
            <select
              className="form-select"
              id="snackSelect"
              value={selectedMeals.snack}
              onChange={(e) => handleMealChange('snack', e.target.value)}
            >
              <option value="">Seleccione Merienda</option>
              {meals.map((meal) => (
                <option key={meal.id} value={meal.id}>{meal.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="dinnerSelect" className="form-label">Cena:</label>
            <select
              className="form-select"
              id="dinnerSelect"
              value={selectedMeals.dinner}
              onChange={(e) => handleMealChange('dinner', e.target.value)}
            >
              <option value="">Seleccione Cena</option>
              {meals.map((meal) => (
                <option key={meal.id} value={meal.id}>{meal.name}</option>
              ))}
            </select>
          </div>

          {/* Extras with multiple selection */}
          <div className="mb-3">
            <label htmlFor="extrasSelect" className="form-label">Extras:</label>
            <select
              multiple
              className="form-select"
              id="extrasSelect"
              value={selectedMeals.extras}
              onChange={handleExtrasChange}
            >
              {meals.map((meal) => (
                <option key={meal.id} value={meal.id}>{meal.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <button type="submit" className="btn btn-primary">Crear Opción</button>
          </div>
        </form>
      ) : (
        <div className="alert alert-success" role="alert">¡Opción creada exitosamente!</div>
      )}

      <div className="nutrition-totals mt-4">
        <h4>Totales Nutricionales:</h4>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td>Calorías: {nutritionTotals.calories.toFixed(2)}</td>
              <td>Libre de Gluten: {nutritionTotals.gluten_free ? 'Sí' : 'No'}</td>
              <td>Contiene Pescado/Mariscos: {nutritionTotals.contains_fish_shellfish_canned_preserved ? 'Sí' : 'No'}</td>
            </tr>
            <tr>
              <td>Proteínas: {nutritionTotals.protein.toFixed(2)}g</td>
              <td>Libre de Lactosa: {nutritionTotals.lactose_free ? 'Sí' : 'No'}</td>
              <td>Cereal: {nutritionTotals.cereal ? 'Sí' : 'No'}</td>
            </tr>
            <tr>
              <td>Carbohidratos: {nutritionTotals.carbohydrates.toFixed(2)}g</td>
              <td>Vegano: {nutritionTotals.vegan ? 'Sí' : 'No'}</td>
              <td>Pasta o Arroz: {nutritionTotals.pasta_or_rice ? 'Sí' : 'No'}</td>
            </tr>
            <tr>
              <td>Grasas: {nutritionTotals.fat.toFixed(2)}g</td>
              <td>Vegetariano: {nutritionTotals.vegetarian ? 'Sí' : 'No'}</td>
              <td>Lácteos (Yogur, Queso): {nutritionTotals.dairy_yogurt_cheese ? 'Sí' : 'No'}</td>
            </tr>
            <tr>
              <td>Azúcares: {nutritionTotals.sugar.toFixed(2)}g</td>
              <td>Pescetariano: {nutritionTotals.pescetarian ? 'Sí' : 'No'}</td>
              <td>Fruta: {nutritionTotals.fruit ? 'Sí' : 'No'}</td>
            </tr>
            <tr>
              <td>Grasas Saturadas: {nutritionTotals.saturated_fat.toFixed(2)}g</td>
              <td>Contiene Carne: {nutritionTotals.contains_meat ? 'Sí' : 'No'}</td>
              <td>Frutos Secos: {nutritionTotals.nuts ? 'Sí' : 'No'}</td>
            </tr>
            <tr>
              <td>Contiene Vegetales: {nutritionTotals.contains_vegetables ? 'Sí' : 'No'}</td>
              <td>Legumbres: {nutritionTotals.legume ? 'Sí' : 'No'}</td>
              <td>Salsas/Condimentos: {nutritionTotals.sauce_or_condiment ? 'Sí' : 'No'}</td>
            </tr>
            <tr>
              <td>Embutidos: {nutritionTotals.deli_meat ? 'Sí' : 'No'}</td>
              <td>Pan/Tostada: {nutritionTotals.bread_or_toast ? 'Sí' : 'No'}</td>
              <td>Huevo: {nutritionTotals.egg ? 'Sí' : 'No'}</td>
            </tr>
            <tr>
              <td>Bebidas Especiales/Suplementos: {nutritionTotals.special_drink_or_supplement ? 'Sí' : 'No'}</td>
              <td>Otros: {nutritionTotals.other ? 'Sí' : 'No'}</td>
              <td>Tubérculo: {nutritionTotals.tuber ? 'Sí' : 'No'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {error && <ToastContainer />}
    </div>
  );
}

export default CreateDayOption;
