import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';

const ClientDetails = ({ clientId, onBack }) => {
    const [client, setClient] = useState(null);
    const [error, setError] = useState('');

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchClientDetails = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/regularusers/${clientId}/`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`
                    }
                });
                setClient(response.data);
            } catch (error) {
                setError('Error al cargar los detalles del cliente');
                console.error("Error al cargar los detalles del cliente:", error.response?.data || error.message);
            }
        };

        fetchClientDetails();
    }, [apiUrl, clientId]);

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    if (!client) {
        return <p>Cargando...</p>;
    }

    return (
        <Container className="mt-4">
            <Button variant="secondary" onClick={onBack}>Volver</Button>
            <h2 className="mt-4">Detalles del Cliente</h2>
            <Table striped bordered hover className="mt-4">
                <tbody>
                    <tr>
                        <td><strong>Nombre de Usuario</strong></td>
                        <td>{client.username}</td>
                    </tr>
                    <tr>
                        <td><strong>Correo Electrónico</strong></td>
                        <td>{client.communication_email}</td>
                    </tr>
                    <tr>
                        <td><strong>Edad</strong></td>
                        <td>{client.profile ? client.profile.age : 'No disponible'}</td>
                    </tr>
                    <tr>
                        <td><strong>Género</strong></td>
                        <td>{client.profile ? client.profile.gender : 'No disponible'}</td>
                    </tr>
                    <tr>
                        <td><strong>Peso</strong></td>
                        <td>{client.weight}</td>
                    </tr>
                    <tr>
                        <td><strong>Altura</strong></td>
                        <td>{client.height}</td>
                    </tr>
                    <tr>
                        <td><strong>Cuello</strong></td>
                        <td>{client.neck}</td>
                    </tr>
                    <tr>
                        <td><strong>Hombro</strong></td>
                        <td>{client.shoulder}</td>
                    </tr>
                    <tr>
                        <td><strong>Pecho</strong></td>
                        <td>{client.chest}</td>
                    </tr>
                    <tr>
                        <td><strong>Cintura</strong></td>
                        <td>{client.waist}</td>
                    </tr>
                    <tr>
                        <td><strong>Cadera</strong></td>
                        <td>{client.hip}</td>
                    </tr>
                    <tr>
                        <td><strong>Brazo</strong></td>
                        <td>{client.arm}</td>
                    </tr>
                    <tr>
                        <td><strong>Glúteo</strong></td>
                        <td>{client.glute}</td>
                    </tr>
                    <tr>
                        <td><strong>Pierna Superior</strong></td>
                        <td>{client.upper_leg}</td>
                    </tr>
                    <tr>
                        <td><strong>Pierna Media</strong></td>
                        <td>{client.middle_leg}</td>
                    </tr>
                    <tr>
                        <td><strong>Pierna Inferior</strong></td>
                        <td>{client.lower_leg}</td>
                    </tr>
                    <tr>
                        <td><strong>Teléfono</strong></td>
                        <td>{client.phone}</td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    );
};

export default ClientDetails;
