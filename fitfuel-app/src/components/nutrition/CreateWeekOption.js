import React, { useState, useEffect } from 'react';
import './CreateWeekOption.css'; // Importa el archivo CSS

function CreateWeekOption() {
  const [name, setName] = useState('');
  const [selectedDayOptions, setSelectedDayOptions] = useState({
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: '',
  });
  const [dayOptions, setDayOptions] = useState([]);
  const [optionCreated, setOptionCreated] = useState(false);
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/nutrition/dayoptions/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`,
      },
    })
    .then(response => response.json())
    .then(data => setDayOptions(data))
    .catch(error => {
      console.error('Error al obtener las opciones de día:', error);
      setError('Error al obtener las opciones de día. Por favor, refresque la página.');
    });
  }, [apiUrl]);

  const handleDayOptionChange = (day, value) => {
    setSelectedDayOptions({ ...selectedDayOptions, [day]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem('authToken');

    const weekOptionData = {
      name,
      ...Object.keys(selectedDayOptions).reduce((acc, day) => {
        acc[`${day}_option`] = selectedDayOptions[day];
        return acc;
      }, {}),
    };

    console.log("Enviando datos de la opción semanal", weekOptionData);

    try {
      const response = await fetch(`${apiUrl}/nutrition/weekoptions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
        body: JSON.stringify(weekOptionData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log('Éxito:', data);
      setOptionCreated(true);
    } catch (error) {
      console.error('Error al crear la opción semanal:', error.message);
      setError('Error al crear la opción semanal. Por favor, intente de nuevo.');
    }
  };

  return (
    <div className="create-week-option-container mt-4">
      <h2>Crear Opción Semanal</h2>
      {!optionCreated ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="weekOptionName" className="form-label">Nombre de la Opción Semanal:</label>
            <input
              type="text"
              className="form-control"
              id="weekOptionName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese el nombre de la opción semanal"
            />
          </div>
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
            <div key={day} className="mb-3">
              <label htmlFor={`${day}Option`} className="form-label">{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
              <select className="form-select" id={`${day}Option`} value={selectedDayOptions[day]} onChange={(e) => handleDayOptionChange(day, e.target.value)}>
                <option value="">Seleccione una opción para {day}</option>
                {dayOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          ))}
          <button type="submit" className="btn btn-primary">Crear Opción Semanal</button>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
        </form>
      ) : (
        <div className="alert alert-success" role="alert">¡Opción semanal creada exitosamente!</div>
      )}
    </div>
  );
}

export default CreateWeekOption;
