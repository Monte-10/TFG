import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ManageDailyDiet() {
  const { dietId } = useParams();
  const [dailyDiets, setDailyDiets] = useState([]);
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState({});
  const [nutritionTotals, setNutritionTotals] = useState({});
  const [mealFilters, setMealFilters] = useState({
    name: '',
    minCalories: { value: '', active: false },
    maxCalories: { value: '', active: false },
    minProtein: { value: '', active: false },
    maxProtein: { value: '', active: false },
    minCarbohydrates: { value: '', active: false },
    maxCarbohydrates: { value: '', active: false },
    minFat: { value: '', active: false },
    maxFat: { value: '', active: false },
    minSugar: { value: '', active: false },
    maxSugar: { value: '', active: false },
    minFiber: { value: '', active: false },
    maxFiber: { value: '', active: false },
    minSaturatedFat: { value: '', active: false },
    maxSaturatedFat: { value: '', active: false },
  })

  useEffect(() => {
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
        let data = await response.json();
  
        // Aplicar los filtros a las comidas
        data = data.filter(meal => {
          let matchesFilter = true;
          if (mealFilters.name && !meal.name.toLowerCase().includes(mealFilters.name.toLowerCase())) matchesFilter = false;
          if (mealFilters.caloriesMin && meal.calories < mealFilters.caloriesMin) matchesFilter = false;
          if (mealFilters.caloriesMax && meal.calories > mealFilters.caloriesMax) matchesFilter = false;
          if (mealFilters.proteinMin && meal.protein < mealFilters.proteinMin) matchesFilter = false;
          if (mealFilters.proteinMax && meal.protein > mealFilters.proteinMax) matchesFilter = false;
          if (mealFilters.carbohydratesMin && meal.carbohydrates < mealFilters.carbohydratesMin) matchesFilter = false;
          if (mealFilters.carbohydratesMax && meal.carbohydrates > mealFilters.carbohydratesMax) matchesFilter = false;
          if (mealFilters.fatMin && meal.fat < mealFilters.fatMin) matchesFilter = false;
          if (mealFilters.fatMax && meal.fat > mealFilters.fatMax) matchesFilter = false;
          if (mealFilters.sugarMin && meal.sugar < mealFilters.sugarMin) matchesFilter = false;
          if (mealFilters.sugarMax && meal.sugar > mealFilters.sugarMax) matchesFilter = false;
          if (mealFilters.fiberMin && meal.fiber < mealFilters.fiberMin) matchesFilter = false;
          if (mealFilters.fiberMax && meal.fiber > mealFilters.fiberMax) matchesFilter = false;
          if (mealFilters.saturatedFatMin && meal.saturated_fat < mealFilters.saturatedFatMin) matchesFilter = false;
          if (mealFilters.saturatedFatMax && meal.saturated_fat > mealFilters.saturatedFatMax) matchesFilter = false;
  
          return matchesFilter;
        });
  
        setMeals(data);
      } catch (error) {
        console.error('Error loading meals:', error);
      }
    };
  
    // Asegurarse de que fetchMeals se llama cada vez que los filtros cambian, además de en el montaje del componente
    fetchDailyDiets();
    fetchMeals();
  }, [dietId, mealFilters]); // Agregar mealFilters a las dependencias de useEffect

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("min") || name.startsWith("max")) {
        // Para los filtros numéricos
        setMealFilters((prev) => ({
            ...prev,
            [name]: { value: value, active: value !== "" },
        }));
    } else {
        // Para el filtro de texto
        setMealFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
  };

  const removeMealFromDailyDiet = (mealId, date) => {
    setSelectedMeals(prev => ({
        ...prev,
        [date]: prev[date].filter(id => id !== mealId),
    }));
  };

  const addMealToDailyDiet = (mealId, date) => {
    setSelectedMeals(prev => ({
      ...prev,
      [date]: prev[date] ? [...prev[date], mealId] : [mealId],
    }));
  };

  const filteredMeals = meals.filter(meal => {
    let matchesFilter = true;
    if (mealFilters.name && !meal.name.toLowerCase().includes(mealFilters.name.toLowerCase())) matchesFilter = false;
    if (mealFilters.minCalories.active && meal.calories < mealFilters.minCalories.value) matchesFilter = false;
    if (mealFilters.maxCalories.active && meal.calories > mealFilters.maxCalories.value) matchesFilter = false;
    if (mealFilters.minProtein.active && meal.protein < mealFilters.minProtein.value) matchesFilter = false;
    if (mealFilters.maxProtein.active && meal.protein > mealFilters.maxProtein.value) matchesFilter = false;
    if (mealFilters.minCarbohydrates.active && meal.carbohydrates < mealFilters.minCarbohydrates.value) matchesFilter = false;
    if (mealFilters.maxCarbohydrates.active && meal.carbohydrates > mealFilters.maxCarbohydrates.value) matchesFilter = false;
    if (mealFilters.minFat.active && meal.fat < mealFilters.minFat.value) matchesFilter = false;
    if (mealFilters.maxFat.active && meal.fat > mealFilters.maxFat.value) matchesFilter = false;
    if (mealFilters.minSugar.active && meal.sugar < mealFilters.minSugar.value) matchesFilter = false;
    if (mealFilters.maxSugar.active && meal.sugar > mealFilters.maxSugar.value) matchesFilter = false;
    if (mealFilters.minFiber.active && meal.fiber < mealFilters.minFiber.value) matchesFilter = false;
    if (mealFilters.maxFiber.active && meal.fiber > mealFilters.maxFiber.value) matchesFilter = false;
    if (mealFilters.minSaturatedFat.active && meal.saturated_fat < mealFilters.minSaturatedFat.value) matchesFilter = false;
      
    return matchesFilter;
  });

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
  
      {/* Controles para filtrar comidas */}
      <div>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={mealFilters.name.value}
          onChange={(e) => handleFilterChange({ ...e, name: 'name' })}
        />
      </div>
      <div>
      <label htmlFor="filterMinCalories">Calorías Mínimas:</label>
          <input
            type="number"
            className="form-control"
            id="filterMinCalories"
            name="minCalories"
            value={mealFilters.minCalories}
            onChange={handleFilterChange}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="filterMaxCalories">Calorías Máximas:</label>
          <input
            type="number"
            className="form-control"
            id="filterMaxCalories"
            name="maxCalories"
            value={mealFilters.maxCalories}
            onChange={handleFilterChange}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="filterMinProtein">Proteínas Mínimas:</label>
          <input
            type="number"
            className="form-control"
            id="filterMinProtein"
            name="minProtein"
            value={mealFilters.minProtein}
            onChange={handleFilterChange}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="filterMaxProtein">Proteínas Máximas:</label>
          <input
            type="number"
            className="form-control"
            id="filterMaxProtein"
            name="maxProtein"
            value={mealFilters.maxProtein}
            onChange={handleFilterChange}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="filterMinCarbohydrates">Carbohidratos Mínimos:</label>
          <input
            type="number"
            className="form-control"
            id="filterMinCarbohydrates"
            name="minCarbohydrates"
            value={mealFilters.minCarbohydrates}
            onChange={handleFilterChange}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="filterMaxCarbohydrates">Carbohidratos Máximos:</label>
          <input
            type="number"
            className="form-control"
            id="filterMaxCarbohydrates"
            name="maxCarbohydrates"
            value={mealFilters.maxCarbohydrates}
            onChange={handleFilterChange}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="filterMinFat">Grasas Mínimas:</label>
          <input
            type="number"
            className="form-control"
            id="filterMinFat"
            name="minFat"
            value={mealFilters.minFat}
            onChange={handleFilterChange}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="filterMaxFat">Grasas Máximas:</label>
          <input
            type="number"
            className="form-control"
            id="filterMaxFat"
            name="maxFat"
            value={mealFilters.maxFat}
            onChange={handleFilterChange}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="filterMinSugar">Azúcar Mínimo:</label>
          <input
            type="number"
            className="form-control"
            id="filterMinSugar"
            name="minSugar"
            value={mealFilters.minSugar}
            onChange={handleFilterChange}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="filterMaxSugar">Azúcar Máximo:</label>
          <input
            type="number"
            className="form-control"
            id="filterMaxSugar"
            name="maxSugar"
            value={mealFilters.maxSugar}
            onChange={handleFilterChange}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="filterMinFiber">Fibra Mínima:</label>
          <input
            type="number"
            className="form-control"
            id="filterMinFiber"
            name="minFiber"
            value={mealFilters.minFiber}
            onChange={handleFilterChange}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="filterMaxFiber">Fibra Máxima:</label> 
          <input
            type="number"
            className="form-control"
            id="filterMaxFiber"
            name="maxFiber"
            value={mealFilters.maxFiber}
            onChange={handleFilterChange}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="filterMinSaturatedFat">Grasas Saturadas Mínimas:</label>
          <input
            type="number"
            className="form-control"
            id="filterMinSaturatedFat"
            name="minSaturatedFat"
            value={mealFilters.minSaturatedFat}
            onChange={handleFilterChange}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="filterMaxSaturatedFat">Grasas Saturadas Máximas:</label>
          <input
            type="number"
            className="form-control"
            id="filterMaxSaturatedFat"
            name="maxSaturatedFat"
            value={mealFilters.maxSaturatedFat}
            onChange={handleFilterChange}
            placeholder="0"
          />
        </div>

      {/* Lista de comidas filtradas */}
      <div>
        {filteredMeals.map((meal) => (
          <div key={meal.id} className="card my-3">
            <div className="card-body">
              <h5>{meal.name}</h5>
              <p>Calorías: {meal.calories}</p>
              <p>Proteínas: {meal.protein}g</p>
              <p>Carbohidratos: {meal.carbohydrates}g</p>
              <p>Grasas: {meal.fat}g</p>
              <p>Azúcar: {meal.sugar}g</p>
              <p>Fibra: {meal.fiber}g</p>
              <p>Grasas Saturadas: {meal.saturated_fat}g</p>
              <button onClick={() => handleMealSelection(meal.id, meal.date)}>
                {selectedMeals[meal.date]?.includes(meal.id) ? 'Quitar de' : 'Añadir a'} {meal.date}
              </button>
            </div>
          </div>
        ))}
      </div>


    
  
      {dailyDiets.map((dailyDiet) => (
        <div key={dailyDiet.id} className="card my-3">
          <div className="card-body">
            <h5>Dieta Diaria para {dailyDiet.date}</h5>
            
            {/* Lista de comidas filtradas para añadir */}
            <div>
              {filteredMeals.map((meal) => (
                <button
                  key={meal.id}
                  onClick={() => addMealToDailyDiet(meal.id, dailyDiet.date)}
                >
                  Añadir {meal.name}
                </button>
              ))}
            </div>
  
            {/* Mostrar comidas seleccionadas para esta fecha */}
            <h6>Comidas seleccionadas:</h6>
            <ul>
              {selectedMeals[dailyDiet.date]?.map(mealId => {
                const meal = meals.find(m => m.id === mealId);
                return <li key={mealId}>{meal?.name}</li>;
              })}
            </ul>
  
            <button
              onClick={() => saveDailyDietMeals(dailyDiet.date)}
              className="btn btn-primary"
            >
              Guardar Comidas para {dailyDiet.date}
            </button>
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
