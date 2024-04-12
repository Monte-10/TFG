import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ManageDailyDiet() {
  const { dietId } = useParams();
  const [dailyDiets, setDailyDiets] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState({});
  const [mealFilters, setMealFilters] = useState({
    name: '',
    minCalories: '',
    maxCalories: '',
    minProtein: '',
    maxProtein: '',
    minCarbohydrates: '',
    maxCarbohydrates: '',
    minFat: '',
    maxFat: '',
    minSugar: '',
    maxSugar: '',
    minFiber: '',
    maxFiber: '',
    minSaturatedFat: '',
    maxSaturatedFat: '',
  });

  useEffect(() => {
    const fetchDailyDiets = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/nutrition/diet/${dietId}/`);
        if (!response.ok) throw new Error('Failed to fetch daily diets');
        const data = await response.json();
        setDailyDiets(data.daily_diets || []);
        const mealsSelection = {};
        data.daily_diets.forEach(dd => {
          mealsSelection[dd.date] = dd.meals.map(m => m.id);
        });
        setSelectedMeals(mealsSelection);
      } catch (error) {
        console.error('Error fetching daily diets:', error);
      }
    };

    fetchDailyDiets();
  }, [dietId]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/nutrition/meals/');
        if (!response.ok) throw new Error('Failed to fetch meals');
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    };

    fetchMeals();
  }, []);

  const applyFilters = () => {
    return meals.filter(meal => {
      return Object.entries(mealFilters).every(([key, value]) => {
        if (!value) return true; // No filter applied
        const field = key.slice(3).toLowerCase();
        const mealValue = meal[field];
        if (key.startsWith('min') && mealValue < Number(value)) return false;
        if (key.startsWith('max') && mealValue > Number(value)) return false;
        if (key === 'name' && !meal.name.toLowerCase().includes(value.toLowerCase())) return false;
        return true;
      });
    });
  };

  const filteredMeals = applyFilters();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setMealFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMealSelection = (mealId, date) => {
    setSelectedMeals(prev => ({
      ...prev,
      [date]: prev[date] ? (prev[date].includes(mealId) ? prev[date].filter(id => id !== mealId) : [...prev[date], mealId]) : [mealId]
    }));
  };

  const handlePageChange = (index) => {
    setCurrentPage(index);
  };

  return (
    <div className="container mt-4">
      <h2>Administrar Dieta Diaria para la Dieta ID: {dietId}</h2>
      <div className="mb-3">
        <button onClick={() => handlePageChange(Math.max(0, currentPage - 1))}>Anterior</button>
        <button onClick={() => handlePageChange(Math.min(dailyDiets.length - 1, currentPage + 1))}>Siguiente</button>
      </div>
      {dailyDiets.length > 0 && (
        <div>
          <h3>Día: {dailyDiets[currentPage].date}</h3>
          <div>
            <h4>Filtros</h4>
            {Object.keys(mealFilters).map((filter) => (
              <div key={filter}>
                <label>{filter}</label>
                <input
                  type="text"
                  value={mealFilters[filter]}
                  onChange={handleFilterChange}
                  name={filter}
                />
              </div>
            ))}
          </div>
          <div>
            <h4>Comidas Disponibles</h4>
            {filteredMeals.map(meal => (
              <div key={meal.id}>
                <div>{meal.name} - {meal.calories} Calorías</div>
                <button onClick={() => handleMealSelection(meal.id, dailyDiets[currentPage].date)}>
                  {selectedMeals[dailyDiets[currentPage].date]?.includes(meal.id) ? 'Quitar' : 'Añadir'}
                </button>
              </div>
            ))}
          </div>
          <div>
            <h4>Comidas Seleccionadas</h4>
            <ul>
              {selectedMeals[dailyDiets[currentPage].date]?.map(mealId => (
                <li key={mealId}>{meals.find(m => m.id === mealId)?.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDailyDiet;
