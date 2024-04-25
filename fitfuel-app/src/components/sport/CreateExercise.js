import React, { useState } from 'react';

function CreateExercise() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [exerciseCreated, setExerciseCreated] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('type', type);
    if (image) formData.append('image', image, image.name);
    formData.append('video_url', videoUrl);

    console.log("Sending exercise data");

    fetch(`${apiUrl}/sport/exercises/`, {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      console.log('Success:', data);
      setExerciseCreated(true);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  return (
    <div className="container mt-4">
      <h2>Crear Ejercicio</h2>
      {exerciseCreated ? (
        <div className="alert alert-success">
          <p>El ejercicio se ha creado correctamente.</p>
          <button className="btn btn-primary" onClick={() => setExerciseCreated(false)}>Crear otro Ejercicio</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exerciseName" className="form-label">Nombre del Ejercicio:</label>
            <input
              type="text"
              className="form-control"
              id="exerciseName"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exerciseDescription" className="form-label">Descripción:</label>
            <textarea
              className="form-control"
              id="exerciseDescription"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exerciseType" className="form-label">Tipo:</label>
            <select className="form-select" id="exerciseType" value={type} onChange={e => setType(e.target.value)}>
              <option value="">Seleccione un tipo</option>
              <option value="FUERZA">Fuerza</option>
              <option value="CARDIO">Cardio</option>
              <option value="FLEXIBILIDAD">Flexibilidad</option>
              <option value="BALANCE">Balance</option>
              <option value="RESISTENCIA">Resistencia</option>
              <option value="HIIT">HIIT</option>
              <option value="FUNCIONAL">Funcional</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="exerciseImage" className="form-label">Imagen (opcional):</label>
            <input
              type="file"
              className="form-control"
              id="exerciseImage"
              onChange={handleImageChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exerciseVideoUrl" className="form-label">URL del Video (opcional):</label>
            <input
              type="text"
              className="form-control"
              id="exerciseVideoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success">Crear Ejercicio</button>
        </form>
      )}
    </div>
  );
}

export default CreateExercise;
