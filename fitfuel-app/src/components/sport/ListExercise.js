import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ListExercise.css';

function ListExercise() {
    const [exercises, setExercises] = useState([]);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetch(`${apiUrl}/sport/exercises/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            setExercises(data);
        })
        .catch(error => console.error('Error fetching exercises:', error));
    }, [apiUrl]);

    const handleDeleteExercise = (exerciseId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este ejercicio?')) {
            fetch(`${apiUrl}/sport/exercises/${exerciseId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
            })
            .then(response => {
                if (response.ok) {
                    setExercises(exercises.filter(exercise => exercise.id !== exerciseId));
                } else {
                    console.error('Error al eliminar el ejercicio');
                }
            })
            .catch(error => console.error('Error al eliminar el ejercicio:', error));
        }
    };

    return (
        <div className="container-list-exercise mt-4">
            <h1 className="mb-4">Lista de Ejercicios</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {exercises.map(exercise => (
                        <tr key={exercise.id} onClick={() => navigate(`/sport/exercise/${exercise.id}`)} style={{ cursor: 'pointer' }}>
                            <td>{exercise.name}</td>
                            <td>{exercise.type}</td>
                            <td>
                                <Link to={`/edit-exercise/${exercise.id}`} className="btn btn-success me-2" onClick={(event) => event.stopPropagation()}>Editar</Link>
                                <button onClick={(event) => { event.stopPropagation(); handleDeleteExercise(exercise.id); }} className="btn btn-danger">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {exercises.length === 0 && (
                <div className="alert alert-info" role="alert">
                    No se encontraron ejercicios.
                </div>
            )}
        </div>
    );
}

export default ListExercise;
