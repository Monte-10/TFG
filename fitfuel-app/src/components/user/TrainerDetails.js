import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Modal } from 'react-bootstrap';

const TrainerDetails = () => {
    const [trainerDetails, setTrainerDetails] = useState(null);
    const [specialties, setSpecialties] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const fetchTrainerDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/trainer-details/`, {
                    headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
                });
                setTrainerDetails(response.data);
            } catch (error) {
                console.error("Error al cargar los detalles del entrenador:", error);
            }
        };

        const fetchSpecialties = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/specialties/`, {
                    headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
                });
                setSpecialties(response.data);
            } catch (error) {
                console.error("Error al cargar las especialidades:", error);
            }
        };

        fetchTrainerDetails();
        fetchSpecialties();
    }, []);

    const handleRemoveTrainer = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/remove_trainer/`, {}, {
                headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
            });
            setTrainerDetails(null);
            setShowConfirm(false);
            console.log("Entrenador eliminado exitosamente", response.data);
        } catch (error) {
            console.error("Error al eliminar el entrenador:", error);
        }
    };

    const handleConfirmClose = () => setShowConfirm(false);
    const handleConfirmShow = () => setShowConfirm(true);

    const getSpecialtyNames = (specialtyIds) => {
        return specialtyIds.map(id => {
            const specialty = specialties.find(spec => spec.id === id);
            return specialty ? specialty.name : id;
        }).join(', ');
    };

    return (
        <Container>
            <h2>Detalles del Entrenador</h2>
            {trainerDetails ? (
                <Card>
                    <Card.Body>
                        <Card.Title>{trainerDetails.username}</Card.Title>
                        <Card.Text>Especialidades: {getSpecialtyNames(trainerDetails.specialties)}</Card.Text>
                        <Card.Text>Tipo de Entrenador: {trainerDetails.trainer_type}</Card.Text>
                        <Card.Text>Email: {trainerDetails.communication_email}</Card.Text>
                        <Card.Text>Teléfono: {trainerDetails.phone}</Card.Text>
                        <Button variant="danger" onClick={handleConfirmShow}>Eliminar Entrenador</Button>
                    </Card.Body>
                </Card>
            ) : (
                <p>No tienes un entrenador asignado.</p>
            )}

            <Modal show={showConfirm} onHide={handleConfirmClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estás seguro de que deseas eliminar a tu entrenador?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleConfirmClose}>Cancelar</Button>
                    <Button variant="danger" onClick={handleRemoveTrainer}>Eliminar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default TrainerDetails;
