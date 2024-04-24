import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function ListExercise() {
    const [exercises, setExercises] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://127.0.0.1:8000/sport/exercises/', {
            method: 'GET', // Asegúrate de que este es el método correcto para tu API
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            setExercises(data);
        })
        .catch(error => console.error('Error fetching exercises:', error));
    }, []);

    const handleDeleteExercise = (exerciseId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este ejercicio?')) {
            fetch(`http://127.0.0.1:8000/sport/exercises/${exerciseId}/`, {
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
        <div className="container">
            <h1>Lista de Ejercicios</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {exercises.map(exercise => (
                        <tr key={exercise.id} onClick={() => navigate(`/sport/exercise/${exercise.id}`)} style={{cursor: 'pointer'}}>
                            <td>{exercise.name}</td>
                            <td>{exercise.type}</td>
                            <td>
                                <Link to={`/edit-exercise/${exercise.id}`} className="btn btn-primary me-2">Editar</Link>
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
