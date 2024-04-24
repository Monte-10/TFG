import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function ListTraining() {
    const [trainings, setTrainings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://127.0.0.1:8000/sport/trainings/', {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setTrainings(data);
        })
        .catch(error => console.error('Error fetching trainings:', error));
    }, []);

    const handleDeleteTraining = (trainingId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este entrenamiento?')) {
            fetch(`http://127.0.0.1:8000/sport/trainings/${trainingId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`
                },
            })
            .then(response => {
                if (response.ok) {
                    setTrainings(trainings.filter(training => training.id !== trainingId));
                } else {
                    console.error('Error al eliminar el entrenamiento');
                }
            })
            .catch(error => console.error('Error al eliminar el entrenamiento:', error));
        }
    };

    return (
        <div className="container">
            <h1>Lista de Entrenamientos</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Usuario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {trainings.map(training => (
                        <tr key={training.id}>
                            <td>{training.name}</td>
                            <td>{training.date}</td>
                            <td>{training.user.username}</td>
                            <td>
                                <Link to={`/sport/training/${training.id}`} className="btn btn-info me-2">Detalles</Link>
                                <Link to={`/sport/edit-training/${training.id}`} className="btn btn-primary me-2">Editar</Link>
                                <button onClick={() => handleDeleteTraining(training.id)} className="btn btn-danger">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {trainings.length === 0 && (
                <div className="alert alert-info" role="alert">
                    No se encontraron entrenamientos que coincidan con los criterios de búsqueda.
                </div>
            )}
        </div>
    );
}

export default ListTraining;
