import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Modal } from 'react-bootstrap';
import './HomePage.css';

function HomePage({ profile }) {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const handleCardClick = (content) => {
        setModalContent(content);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalContent(null);
    };

    const nutritionOptions = (
        <>
            <h3>Nutrición</h3>
            <ul>
                <li><Link to="/nutrition/create-food">Crear Alimento</Link></li>
                <li><Link to="/nutrition/create-ingredient">Crear Ingrediente</Link></li>
                <li><Link to="/nutrition/create-dish">Crear Plato</Link></li>
                <li><Link to="/nutrition/create-meal">Crear Comida</Link></li>
                <li><Link to="/nutrition/create-diet">Crear Dieta</Link></li>
                <li><Link to="/nutrition/upload-food">Subir Alimento</Link></li>
            </ul>
        </>
    );

    const optionOptions = (
        <>
            <h3>Opciones</h3>
            <ul>
                <li><Link to="/nutrition/create-dayoption">Crear Opción Diaria</Link></li>
                <li><Link to="/nutrition/create-weekoption">Crear Opción Semanal</Link></li>
                <li><Link to="/nutrition/create-option">Crear Opción</Link></li>
                <li><Link to="/nutrition/assign-option">Asignar Opción</Link></li>
                <li><Link to="/nutrition/adapt-option">Adaptar Opción</Link></li>
            </ul>
        </>
    );

    const listOptions = (
        <>
            <h3>Listado</h3>
            <ul>
                <li><Link to="/nutrition/list-food">Listar Alimentos</Link></li>
                <li><Link to="/nutrition/list-ingredient">Listar Ingredientes</Link></li>
                <li><Link to="/nutrition/list-dish">Listar Platos</Link></li>
                <li><Link to="/nutrition/list-meal">Listar Comidas</Link></li>
            </ul>
        </>
    );

    const sportOptions = (
        <>
            <h3>Deporte</h3>
            <ul>
                <li><Link to="/sport/create-exercise">Crear Ejercicio</Link></li>
                <li><Link to="/sport/list-exercise">Listar Ejercicios</Link></li>
                <li><Link to="/sport/create-training">Crear Entrenamiento</Link></li>
                <li><Link to="/sport/list-training">Listar Entrenamientos</Link></li>
                <li><Link to="/sport/create-week-training">Crear Entrenamiento Semanal</Link></li>
                <li><Link to="/sport/assign-week-training">Asignar Entrenamiento Semanal</Link></li>
            </ul>
        </>
    );

    return (
        <Container className="home-page mt-4">
            <h1 className="welcome-text">Bienvenido a FitFuelBalance</h1>
            <p className="intro-text">Elige una de las opciones a continuación para comenzar:</p>
            {profile?.role === "trainer" ? (
                <Row className="row-centered">
                    <Col md={3}>
                        <Card className="option-card" onClick={() => handleCardClick(nutritionOptions)}>
                            <Card.Body>
                                <Card.Title>Alimentos</Card.Title>
                                <Card.Text>Ver opciones</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="option-card" onClick={() => handleCardClick(optionOptions)}>
                            <Card.Body>
                                <Card.Title>Opciones</Card.Title>
                                <Card.Text>Ver opciones</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="option-card" onClick={() => handleCardClick(listOptions)}>
                            <Card.Body>
                                <Card.Title>Listados</Card.Title>
                                <Card.Text>Ver opciones</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="option-card" onClick={() => handleCardClick(sportOptions)}>
                            <Card.Body>
                                <Card.Title>Deporte</Card.Title>
                                <Card.Text>Ver opciones</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <Row className="row-centered">
                    <Col md={6}>
                        <Link to="/assigned-options" className="home-option">
                            <Card className="option-card">
                                <Card.Body>
                                    <Card.Title>Dietas</Card.Title>
                                    <Card.Text>Ver opciones</Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                    <Col md={6}>
                        <Link to="/assigned-week-trainings" className="home-option">
                            <Card className="option-card">
                                <Card.Body>
                                    <Card.Title>Entrenamientos</Card.Title>
                                    <Card.Text>Ver opciones</Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                </Row>
            )}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalContent?.props.children[0]}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalContent?.props.children.slice(1)}
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default HomePage;
