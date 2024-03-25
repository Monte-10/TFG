import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ManageClients() {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const trainerId = localStorage.getItem('userId');
        const authToken = localStorage.getItem('authToken');
        fetch(`http://127.0.0.1:8000/user/trainers/${trainerId}/clients`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`, // Asegúrate que este es el método de autenticación correcto para tu backend
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setClients(data.clients); // Ajusta según la estructura de tu respuesta
        })
        .catch((error) => console.error('Error fetching clients:', error));
    }, []);

    return (
        <div className="container">
            <h2>Mis Clientes</h2>
            {clients.length > 0 ? (
                clients.map(client => (
                    <div key={client.id} className="client-card">
                        <h3>{client.name}</h3>
                        {/* Más detalles sobre el cliente */}
                        
                        {/* Ejemplo de enlace a una página de detalles del cliente */}
                        <Link to={`/client-details/${client.id}`} className="btn btn-primary">
                            Ver detalles
                        </Link>

                        {/* Otros enlaces de gestión, como editar, asignar dietas, entrenamientos, etc. */}
                    </div>
                ))
            ) : (
                <p>No tienes clientes asignados aún.</p>
            )}
        </div>
    );
}

export default ManageClients;