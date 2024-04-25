import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function TrainingDetails() {
  const { id } = useParams();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/sport/trainings/${id}/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Failed to fetch training details');
    })
    .then(data => {
      setTraining(data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error:', error);
      setError('Failed to load training details');
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h1>Detalles del Entrenamiento</h1>
      {training ? (
        <div>
          <h2>{training.name}</h2>
          <p>Fecha: {training.date}</p>
          <p>Usuario: {training.user.username}</p>
          <h3>Ejercicios</h3>
          <ul>
            {training.exercises_details.map((ex, index) => (
              <li key={index}>
                {ex.exercise.name} - Repeticiones: {ex.repetitions}, Series: {ex.sets}, Peso: {ex.weight}, Tiempo: {ex.time}
              </li>
            ))}
          </ul>
          <Link to="/sport/trainings">Volver a la lista de entrenamientos</Link>
        </div>
      ) : (
        <p>No se encontró el entrenamiento.</p>
      )}
    </div>
  );
}

export default TrainingDetails;
