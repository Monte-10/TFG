import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Componente para cada entrenador en la lista
const Trainer = ({ trainer, onSendRequest }) => (
  <div className="trainer">
    <h3>{trainer.username}</h3>
    <p>Especialidad: {trainer.specialty}</p>
    <pre>{JSON.stringify(trainer, null, 2)}</pre> {/* Display all fields for debugging */}
    <button onClick={() => onSendRequest(trainer.id)}>Enviar Solicitud</button>
  </div>
);

const TrainerList = ({ onSendRequest }) => {
    const [trainers, setTrainers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/trainers/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`
                    }
                });
                console.log(response.data); // Log the response to check what fields are returned
                setTrainers(response.data);
            } catch (error) {
                console.error("Error al buscar entrenadores:", error);
                setError("Error al buscar entrenadores. Por favor, inténtelo de nuevo más tarde.");
            }
        };

        fetchTrainers();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Entrenadores Disponibles</h2>
            {error && <p className="text-danger">{error}</p>}
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
