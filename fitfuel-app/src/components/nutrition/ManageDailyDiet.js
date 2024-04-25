import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ManageDailyDiet() {
  const { dietId } = useParams();
const [dietName, setDietName] = useState('');
const [dailyDiets, setDailyDiets] = useState([]);
const [currentPage, setCurrentPage] = useState(0);
const apiUrl = process.env.REACT_APP_API_URL;
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
            const response = await fetch(`${apiUrl}/nutrition/diet/${dietId}/`);
            if (!response.ok) throw new Error('Failed to fetch daily diets');
            const data = await response.json();
            setDailyDiets(data.daily_diets || []);
            setDietName(data.name);
            const mealsSelection = {};
            data.daily_diets.forEach(dd => {
                mealsSelection[dd.date] = dd.meals.map(m => m.id); // Ensure this is always an array
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
        const response = await fetch(`${apiUrl}/nutrition/meals/`);
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
    setSelectedMeals(prev => {
        const updatedMealsForDate = prev[date] ? [...prev[date]] : [];
        if (!updatedMealsForDate.includes(mealId)) {
            updatedMealsForDate.push(mealId);
        }
        return { ...prev, [date]: updatedMealsForDate };
    });
};


const handleMealRemoval = (mealId, date) => {
  setSelectedMeals(prev => {
      const updatedMealsForDate = prev[date] ? prev[date].filter(id => id !== mealId) : [];
      return { ...prev, [date]: updatedMealsForDate };
  });
};

  const handlePageChange = (index) => {
    setCurrentPage(index);
  };

  const saveDailyDiet = async () => {
    const dailyDiet = dailyDiets[currentPage];
    if (!dailyDiet) {
      alert('No se encontró el Daily Diet para la página actual');
      return;
    }

    const mealIds = selectedMeals[dailyDiet.date] || [];

    try {
      const response = await fetch(`${apiUrl}/nutrition/daily_diets/${dailyDiet.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meals: mealIds }),
      });

      if (!response.ok) {
        const errorDetail = await response.json();
        throw new Error(`HTTP error! status: ${response.status} - ${errorDetail.detail}`);
      }

      alert('Dieta diaria actualizada con éxito!');
    } catch (error) {
      console.error('Error saving daily diet:', error);
      alert('Error al guardar la dieta diaria: ' + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Administrar Dieta Diaria para la Dieta: {dietName}</h2>
      <div className="mb-3">
        <button onClick={() => handlePageChange(Math.max(0, currentPage - 1))}>Anterior</button>
        <button onClick={() => handlePageChange(Math.min(dailyDiets.length - 1, currentPage + 1))}>Siguiente</button>
      </div>

      {dailyDiets.length > 0 && (
        <div>
          <h3>Día: {dailyDiets[currentPage].date}</h3>
          <div className="row mb-4">
            {Object.keys(mealFilters).map((filter) => (
              <div key={filter} className="col-md-4">
                <input
                  type={filter.includes('Calories') || filter.includes('Protein') || filter.includes('Fat') || filter.includes('Sugar') || filter.includes('Fiber') || filter.includes('SaturatedFat') ? "number" : "text"}
                  className="form-control"
                  placeholder={filter}
                  value={mealFilters[filter]}
                  onChange={handleFilterChange}
                  name={filter}
                />
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col-md-6">
              <h4>Comidas Disponibles</h4>
              {filteredMeals.map(meal => (
                <div key={meal.id} className="card mb-2">
                  <div className="card-body">
                    <h5 className="card-title">{meal.name} - {meal.calories} Calorías</h5>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleMealSelection(meal.id, dailyDiets[currentPage].date)}
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-md-6">
              <h4>Comidas Seleccionadas</h4>
              <ul className="list-group">
                {selectedMeals[dailyDiets[currentPage].date]?.map((mealId, index) => {
                  const meal = meals.find(m => m.id === mealId);
                  return (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {meal?.name}
                      <button className="btn btn-warning btn-sm" onClick={() => handleMealRemoval(mealId, dailyDiets[currentPage].date)}>Quitar</button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center mt-3">
              <button className="btn btn-success" onClick={saveDailyDiet}>Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDailyDiet;
