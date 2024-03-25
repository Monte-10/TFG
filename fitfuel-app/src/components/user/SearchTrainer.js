import React, { useState } from 'react';
import axios from 'axios';

const SearchTrainer = ({ onSearch }) => {
    const [specialty, setSpecialty] = useState('');
    const [trainerType, setTrainerType] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        onSearch(specialty, trainerType);
    };

    const searchTrainers = async (criteria) => {
        try {
            const response = await axios.get('/api/trainers/search', { params: criteria });
            return response.data;
        } catch (error) {
            console.error("Error al buscar entrenadores:", error);
            return [];
        }
    };

    return (
        <div>
            <h2>Buscar Entrenador</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Especialidad:</label>
                    <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                        <option value="">Seleccionar</option>
                        <option value="weight_loss">Pérdida de peso</option>
                        <option value="muscle_gain">Ganancia muscular</option>
                        <option value="strength">Fuerza</option>
                        <option value="endurance">Resistencia</option>
                        <option value="flexibility">Flexibilidad</option>
                        <option value="other">Otro</option>
                    </select>
                </div>
                <div>
                    <label>Tipo de Entrenador:</label>
                    <select value={trainerType} onChange={(e) => setTrainerType(e.target.value)}>
                        <option value="">Seleccionar</option>
                        <option value="trainer">Entrenador</option>
                        <option value="nutritionist">Nutricionista</option>
                        <option value="both">Ambos</option>
                    </select>
                </div>
                <button type="submit">Buscar</button>
            </form>
        </div>
    );
};

export default SearchTrainer;
