import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdaptDietOrOption() {
  const [selection, setSelection] = useState('diet');
  const [diets, setDiets] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [userData, setUserData] = useState({
    age: '',
    sex: 'male',
    height: '',
    weight: '',
    activityLevel: '1.2',
    goal: 'maintenance'
  });
  const [adaptedPlan, setAdaptedPlan] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dietsResponse = await axios.get(`${apiUrl}/nutrition/diet/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` },
        });
        const optionsResponse = await axios.get(`${apiUrl}/nutrition/options/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` },
        });
        setDiets(dietsResponse.data);
        setOptions(optionsResponse.data);
      } catch (error) {
        setError('Failed to fetch data. Please try again later.');
      }
    };
    fetchData();
  }, [apiUrl]);

  const handleSelectionChange = (e) => {
    setSelection(e.target.value);
    setSelectedId('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post(`${apiUrl}/nutrition/adapt-diet-or-option/`, {
        user_id: userId,
        plan_id: selectedId,
        plan_type: selection,
        calories: calculateCalories(userData)
      }, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
      });
      setAdaptedPlan(response.data);
      setError('');
    } catch (error) {
      setError('Failed to adapt plan. Please try again.');
    }
  };

  const calculateCalories = ({ age, sex, height, weight, activityLevel, goal }) => {
    let bmr;
    if (sex === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    const maintenanceCalories = bmr * activityLevel;
    if (goal === 'weight_loss') {
      return maintenanceCalories - 500;
    } else if (goal === 'muscle_gain') {
      return maintenanceCalories + 500;
    }
    return maintenanceCalories;
  };

  return (
    <div className="container mt-4">
      <h2>Adaptar Dieta u Opción</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Seleccionar:</label>
          <select className="form-select" value={selection} onChange={handleSelectionChange}>
            <option value="diet">Dieta</option>
            <option value="option">Opción</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">{selection === 'diet' ? 'Dietas' : 'Opciones'} Disponibles:</label>
          <select className="form-select" value={selectedId} onChange={(e) => setSelectedId(e.target.value)} required>
            <option value="">Seleccionar</option>
            {(selection === 'diet' ? diets : options).map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Edad:</label>
          <input type="number" className="form-control" name="age" value={userData.age} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Sexo:</label>
          <select className="form-select" name="sex" value={userData.sex} onChange={handleChange} required>
            <option value="male">Hombre</option>
            <option value="female">Mujer</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Altura (cm):</label>
          <input type="number" className="form-control" name="height" value={userData.height} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Peso (kg):</label>
          <input type="number" className="form-control" name="weight" value={userData.weight} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Nivel de Actividad:</label>
          <select className="form-select" name="activityLevel" value={userData.activityLevel} onChange={handleChange} required>
            <option value="1.2">Sedentario</option>
            <option value="1.375">Ligera Actividad</option>
            <option value="1.55">Moderada Actividad</option>
            <option value="1.725">Alta Actividad</option>
            <option value="1.9">Muy Alta Actividad</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Objetivo:</label>
          <select className="form-select" name="goal" value={userData.goal} onChange={handleChange} required>
            <option value="weight_loss">Pérdida de peso</option>
            <option value="muscle_gain">Ganancia de músculo</option>
            <option value="maintenance">Mantenimiento</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Adaptar {selection === 'diet' ? 'Dieta' : 'Opción'}</button>
      </form>

      {adaptedPlan && (
        <div className="mt-4">
          <h3>{selection === 'diet' ? 'Dieta' : 'Opción'} Adaptada</h3>
          <pre>{JSON.stringify(adaptedPlan, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default AdaptDietOrOption;
