import React, { useState, useEffect } from 'react';
import './CreateOption.css';

function CreateOption() {
  const [name, setName] = useState('');
  const [weekOptions, setWeekOptions] = useState([]);
  const [selectedWeekOptions, setSelectedWeekOptions] = useState({
    week_option_one: '',
    week_option_two: '',
    week_option_three: '',
  });
  const [optionCreated, setOptionCreated] = useState(false);
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/nutrition/weekoptions/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`,
      },
    })
    .then(response => response.json())
    .then(data => setWeekOptions(data))
    .catch(error => {
      console.error('Error al obtener las opciones semanales:', error);
      setError('Error al obtener las opciones semanales. Por favor, refresque la página.');
    });
  }, [apiUrl]);

  const handleWeekOptionChange = (weekOptionType, value) => {
    setSelectedWeekOptions({ ...selectedWeekOptions, [weekOptionType]: value });
  };

  const handleDownloadPdf = async (optionId) => {
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`${apiUrl}/nutrition/options/${optionId}/pdf/`, {
      headers: {
        'Authorization': `Token ${authToken}`,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${name}_option.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } else {
      console.error('Error al descargar el PDF:', await response.text());
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem('authToken');

    const optionData = {
      name,
      ...selectedWeekOptions,
    };

    console.log("Enviando datos de la opción", optionData);

    try {
      const response = await fetch(`${apiUrl}/nutrition/options/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
        body: JSON.stringify(optionData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log('Éxito:', data);
      setOptionCreated(true);

      handleDownloadPdf(data.id);
    } catch (error) {
      console.error('Error al crear la opción:', error);
      setError(`Error al crear la opción. Por favor, intente de nuevo. Error: ${error.toString()}`);
    }
  };

  return (
    <div className="create-option-container mt-4">
      <h2>Crear Opción</h2>
      {!optionCreated ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="optionName" className="form-label">Nombre de la Opción:</label>
            <input
              type="text"
              className="form-control"
              id="optionName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese el nombre de la opción"
            />
          </div>
          {['week_option_one', 'week_option_two', 'week_option_three'].map((weekOptionType, index) => (
            <div key={weekOptionType} className="mb-3">
              <label htmlFor={`${weekOptionType}Select`} className="form-label">Opción Semanal {index + 1}:</label>
              <select className="form-select" id={`${weekOptionType}Select`} value={selectedWeekOptions[weekOptionType]} onChange={(e) => handleWeekOptionChange(weekOptionType, e.target.value)}>
                <option value="">Seleccione la Opción Semanal {index + 1}</option>
                {weekOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          ))}
          <button type="submit" className="btn btn-primary">Crear Opción</button>
        </form>
      ) : (
        <>
          <div className="alert alert-success" role="alert">
            ¡Opción creada exitosamente!
          </div>
        </>
      )}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
    </div>
  );
}

export default CreateOption;
