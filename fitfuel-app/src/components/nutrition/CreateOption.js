import React, { useState, useEffect } from 'react';

function CreateOption() {
  const [meals, setMeals] = useState([]);
  const [optionData, setOptionData] = useState({
    name: '',
    breakfast: '',
    mid_morning: '',
    lunch: '',
    snack: '',
    dinner: '',
    extras: []
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/nutrition/meals/')
      .then(response => response.json())
      .then(data => setMeals(data))
      .catch(error => {
        console.error('Error fetching meals:', error);
        setStatusMessage('Error al cargar las comidas.');
        setIsError(true);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'extras') {
      let newExtras = [...optionData.extras];
      if (newExtras.includes(value)) {
        newExtras = newExtras.filter(extra => extra !== value);
      } else {
        newExtras.push(value);
      }
      setOptionData({ ...optionData, extras: newExtras });
    } else {
      setOptionData({ ...optionData, [name]: value });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Sending option data", optionData);

    fetch('http://127.0.0.1:8000/nutrition/options/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(optionData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('La respuesta de la red no fue ok.');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      setStatusMessage('La opción se ha creado correctamente.');
      setIsError(false);
    })
    .catch((error) => {
      console.error('Error:', error);
      setStatusMessage('Error al crear la opción: ' + error.message);
      setIsError(true);
    });
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={optionData.name}
          onChange={handleChange}
          placeholder="Nombre de la Opción"
        />
        {/* Repetir este patrón para cada comida del día */}
        {['breakfast', 'mid_morning', 'lunch', 'snack', 'dinner'].map((mealTime) => (
          <select
            key={mealTime}
            name={mealTime}
            value={optionData[mealTime]}
            onChange={handleChange}
          >
            <option value="">{`Seleccione ${mealTime}`}</option>
            {meals.map((meal) => (
              <option key={meal.id} value={meal.id}>{meal.name}</option>
            ))}
          </select>
        ))}
        {/* Manejar los extras como múltiples selecciones */}
        <fieldset>
          <legend>Extras</legend>
          {meals.map((meal) => (
            <div key={meal.id}>
              <input
                type="checkbox"
                id={`extra-${meal.id}`}
                name="extras"
                value={meal.id}
                checked={optionData.extras.includes(meal.id.toString())}
                onChange={handleChange}
              />
              <label htmlFor={`extra-${meal.id}`}>{meal.name}</label>
            </div>
          ))}
        </fieldset>
        <button type="submit">Crear Opción</button>
      </form>
      {statusMessage && (
        <p style={{ color: isError ? 'red' : 'green' }}>{statusMessage}</p>
      )}
    </div>
  );
}

export default CreateOption;
