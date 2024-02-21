import React, { useState, useEffect } from 'react';

function ManageDailyDiet() {
  const [diets, setDiets] = useState([]);
  const [selectedDiet, setSelectedDiet] = useState('');
  const [dailyDiets, setDailyDiets] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);

  useEffect(() => {
    // Cargar las Dietas disponibles
    fetch('http://127.0.0.1:8000/nutrition/diets/')
      .then(response => response.json())
      .then(data => {
        setDiets(data);
      });

    // Cargar las comidas disponibles
    fetch('http://127.0.0.1:8000/nutrition/meals/')
      .then(response => response.json())
      .then(data => {
        setMeals(data);
      });
  }, []);

  useEffect(() => {
    // Cargar los DailyDiet asociados a la Dieta seleccionada
    if (selectedDiet) {
      fetch(`http://127.0.0.1:8000/nutrition/dailydiets/?diet=${selectedDiet}`)
        .then(response => response.json())
        .then(data => {
          setDailyDiets(data);
        });
    }
  }, [selectedDiet]);

  const handleDietChange = (e) => {
    setSelectedDiet(e.target.value);
    // Restablecer la selección de DailyDiet y comidas al cambiar de Dieta
    setSelectedDate('');
    setSelectedMeals([]);
  };

  const handleDailyDietChange = (e) => {
    setSelectedDate(e.target.value);
    // Actualizar las comidas seleccionadas para el DailyDiet seleccionado
    const dailyDiet = dailyDiets.find(dd => dd.date === e.target.value);
    if (dailyDiet) {
      setSelectedMeals(dailyDiet.meals.map(meal => meal.id));
    }
  };

  const handleMealSelection = (mealId) => {
    const updatedSelectedMeals = selectedMeals.includes(mealId) 
      ? selectedMeals.filter(id => id !== mealId) 
      : [...selectedMeals, mealId];
    setSelectedMeals(updatedSelectedMeals);
    // Aquí podrías agregar lógica para actualizar las comidas del DailyDiet en el backend
  };

  return (
    <div>
      <h2>Gestionar DailyDiet</h2>
      <label>
        Selecciona una Dieta:
        <select value={selectedDiet} onChange={handleDietChange}>
          <option value="">Seleccione una Dieta</option>
          {diets.map(diet => (
            <option key={diet.id} value={diet.id}>{diet.name}</option>
          ))}
        </select>
      </label>
      {selectedDiet && (
        <>
          <label>
            Selecciona un Día:
            <select value={selectedDate} onChange={handleDailyDietChange}>
              <option value="">Seleccione un Día</option>
              {dailyDiets.map(dd => (
                <option key={dd.date} value={dd.date}>{dd.date}</option>
              ))}
            </select>
          </label>
          <div>
            Selecciona las Comidas:
            {meals.map(meal => (
              <div key={meal.id}>
                <input
                  type="checkbox"
                  checked={selectedMeals.includes(meal.id)}
                  onChange={() => handleMealSelection(meal.id)}
                />
                {meal.name}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ManageDailyDiet;
