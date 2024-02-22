import React, { useState, useEffect } from 'react';

function CreateTraining() {
  const [exercises, setExercises] = useState([]); // Lista de ejercicios disponibles
  const [selectedExercises, setSelectedExercises] = useState([]); // Ejercicios seleccionados para el entrenamiento
  const [trainingName, setTrainingName] = useState(''); // Nombre del entrenamiento
  const [error, setError] = useState('');

  useEffect(() => {
    // Cargar los ejercicios disponibles
    fetch('http://127.0.0.1:8000/sport/exercises/')
      .then(response => response.json())
      .then(data => setExercises(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleAddExercise = () => {
    setSelectedExercises([...selectedExercises, { exerciseId: '', repetitions: '', sets: '', weight: '', time: '' }]);
  };

  const handleChange = (index, field, value) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index][field] = value;
    setSelectedExercises(updatedExercises);
  };

  console.log(selectedExercises)

  const handleSubmit = (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem('authToken'); // Asumiendo que el token está almacenado en localStorage

    const trainingData = {
      name: trainingName,
      exercises: selectedExercises.map(exercise => ({
        exercise_id: exercise.exerciseid, // Asegúrate de que los nombres de campo coincidan con los esperados por tu backend
        repetitions: exercise.repetitions,
        sets: exercise.sets,
        weight: exercise.weight,
        time: exercise.time
      }))
    };

    fetch('http://127.0.0.1:8000/sport/trainings/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}` // Asegúrate de utilizar el esquema de autenticación correcto
      },
      body: JSON.stringify(trainingData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al crear el entrenamiento');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
    })
    .catch((error) => {
      setError('Error al crear el entrenamiento');
      console.error('Error:', error);
    });
  };

  return (
    <div>
      <h2>Crear Entrenamiento</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nombre del Entrenamiento:
            <input type="text" value={trainingName} onChange={(e) => setTrainingName(e.target.value)} />
          </label>
        </div>
        {selectedExercises.map((exercise, index) => (
          <div key={index}>
            <select value={exercise.exerciseId} onChange={(e) => handleChange(index, 'exerciseId', e.target.value)}>
              <option value="">Selecciona un ejercicio</option>
              {exercises.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
            <input type="number" placeholder="Repeticiones" value={exercise.repetitions} onChange={(e) => handleChange(index, 'repetitions', e.target.value)} />
            <input type="number" placeholder="Series" value={exercise.sets} onChange={(e) => handleChange(index, 'sets', e.target.value)} />
            <input type="text" placeholder="Peso (opcional)" value={exercise.weight} onChange={(e) => handleChange(index, 'weight', e.target.value)} />
            <input type="number" placeholder="Tiempo en segundos (opcional)" value={exercise.time} onChange={(e) => handleChange(index, 'time', e.target.value)} />
          </div>
        ))}
        <button type="button" onClick={handleAddExercise}>Añadir Ejercicio</button>
        <button type="submit">Guardar Entrenamiento</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default CreateTraining;
