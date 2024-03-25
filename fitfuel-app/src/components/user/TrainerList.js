import React from 'react';
import axios from 'axios';

// Componente para cada entrenador en la lista
const Trainer = ({ trainer, onSendRequest }) => (
  <div className="trainer">
    <h3>{trainer.name}</h3>
    <p>Especialidad: {trainer.specialty}</p>
    <button onClick={() => onSendRequest(trainer.id)}>Enviar Solicitud</button>
  </div>
);

const sendRequestToTrainer = async (trainerId) => {
    try {
      const response = await axios.post('/api/requests/send', { trainerId });
      // Maneja la respuesta, como actualizar la UI o mostrar un mensaje
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
    }
  };

// Componente de la lista de entrenadores
const TrainerList = ({ trainers, onSendRequest }) => {
  return (
    <div className="trainer-list">
      <h2>Entrenadores Disponibles</h2>
      {trainers.length > 0 ? (
        trainers.map((trainer) => (
          <Trainer key={trainer.id} trainer={trainer} onSendRequest={onSendRequest} />
        ))
      ) : (
        <p>No se encontraron entrenadores.</p>
      )}
    </div>
  );
};

export default TrainerList;
