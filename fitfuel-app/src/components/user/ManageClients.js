import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';

const ManageClients = ({ onClientSelect }) => {
    const [clients, setClients] = useState([]);
    const [error, setError] = useState('');

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/trainer/clients/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`
                    }
                });
                setClients(response.data);
            } catch (error) {
                setError('Error al cargar los clientes');
                console.error("Error al cargar los clientes:", error.response?.data || error.message);
            }
        };

        fetchClients();
    }, [apiUrl]);

    return (
        <Container className="mt-4">
            <h2>Mis Clientes</h2>
            {error && <p className="text-danger">{error}</p>}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nombre de Usuario</th>
                        <th>Correo Electrónico</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(client => (
                        <tr key={client.id}>
                            <td>{client.username}</td>
                            <td>{client.email}</td>
                            <td>
                                <Button variant="info" onClick={() => onClientSelect(client.id)}>
                                    Ver Detalles
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ManageClients;
