import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Container, Navbar, Nav, Offcanvas, Accordion, Dropdown } from 'react-bootstrap';
import axios from 'axios';

import HomePage from './components/HomePage';
import CreateIngredient from './components/nutrition/CreateIngredient';
import CreateFood from './components/nutrition/CreateFood';
import CreateDish from './components/nutrition/CreateDish';
import CreateMeal from './components/nutrition/CreateMeal';
import CreateDiet from './components/nutrition/CreateDiet';
import ListFood from './components/nutrition/ListFood';
import CreateExercise from './components/sport/CreateExercise';
import ExerciseDetails from './components/sport/ExerciseDetails';
import EditExercise from './components/sport/EditExercise';
import CreateTraining from './components/sport/CreateTraining';
import Login from './components/user/Login';
import RegularUserSignUp from './components/user/RegularSignUp';
import TrainerSignUp from './components/user/TrainerSignUp';
import UploadFood from './components/nutrition/UploadFood';
import CreateDayOption from './components/nutrition/CreateDayOption';
import CreateWeekOption from './components/nutrition/CreateWeekOption';
import CreateOption from './components/nutrition/CreateOption';
import AssignOptionToUser from './components/nutrition/AssignOptionToUser';
import FoodDetails from './components/nutrition/FoodDetails';
import ManageDailyDiet from './components/nutrition/ManageDailyDiet';
import SearchTrainer from './components/user/SearchTrainer';
import TrainerList from './components/user/TrainerList';
import ListIngredient from './components/nutrition/ListIngredient';
import IngredientDetails from './components/nutrition/IngredientDetails';
import ListDish from './components/nutrition/ListDish';
import ListMeal from './components/nutrition/ListMeal';
import EditFood from './components/nutrition/EditFood';
import EditIngredient from './components/nutrition/EditIngredient';
import EditDish from './components/nutrition/EditDish';
import EditMeal from './components/nutrition/EditMeal';
import EditDiet from './components/nutrition/EditDiet';
import ListExercise from './components/sport/ListExercise';
import EditTraining from './components/sport/EditTraining';
import ListTraining from './components/sport/ListTraining';
import TrainingDetails from './components/sport/TrainingDetails';
import AdaptDietOrOption from './components/nutrition/AdaptDietOrOption';
import Profile from './components/user/Profile';

function App() {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');
    const [trainers, setTrainers] = useState([]);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (authToken) {
            const fetchProfile = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile/`, {
                        headers: { 'Authorization': `Token ${authToken}` }
                    });
                    setProfile(response.data);
                } catch (error) {
                    console.error("Error al cargar el perfil:", error);
                }
            };

            fetchProfile();
        }
    }, [authToken]);

    const handleLoginSuccess = (token, userId) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId);
        setAuthToken(token);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        setAuthToken('');
    };

    const handleSearchTrainers = async (specialty, trainerType) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/search_trainer/`, {
                params: { specialty, trainerType },
                headers: { 'Authorization': `Token ${authToken}` }
            });
            setTrainers(response.data);
        } catch (error) {
            console.error("Error al buscar entrenadores:", error);
        }
    };

    const handleSendRequest = async (trainerId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/send_request/${trainerId}/`, {}, {
                headers: { 'Authorization': `Token ${authToken}` }
            });
            console.log("Solicitud enviada con éxito", response.data);
        } catch (error) {
            console.error("Error al enviar solicitud:", error);
        }
    };

    return (
        <Router>
            <div className="App">
                <Navbar bg="light" expand={false}>
                    <Container fluid>
                        <Navbar.Toggle aria-controls="offcanvasNavbar" />
                        <Navbar.Brand as={NavLink} to="/" className="mx-auto">FitFuelBalance</Navbar.Brand>
                        {authToken ? (
                            <Dropdown className="mb-3 ms-auto">
                                <Dropdown.Toggle variant="secondary" id="dropdown-user">
                                    {profile?.username || "Usuario"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={NavLink} to="/profile">Ver Perfil</Dropdown.Item>
                                    <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <Nav className="flex-column mb-3 ms-auto">
                                <Nav.Item>
                                    <Nav.Link as={NavLink} to="/login">Iniciar Sesión</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link as={NavLink} to="/signup/regularuser">Registrarse como Usuario</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link as={NavLink} to="/signup/trainer">Registrarse como Entrenador</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        )}
                        <Navbar.Offcanvas id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel" placement="start">
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id="offcanvasNavbarLabel">Menú</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Accordion>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Nutrición</Accordion.Header>
                                        <Accordion.Body>
                                            <Nav className="flex-column">
                                                <p className="mt-2 mb-1"><strong>Creación de Alimentos</strong></p>
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/nutrition/create-food">Crear Alimento</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/nutrition/create-ingredient">Crear Ingrediente</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/nutrition/create-dish">Crear Plato</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/nutrition/create-meal">Crear Comida</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/nutrition/create-diet">Crear Dieta</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/nutrition/upload-food">Subir Alimento</Nav.Link>
                                                </Nav.Item>
                                                <p className="mt-2 mb-1"><strong>Creación de Opciones</strong></p>
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/nutrition/create-dayoption">Crear Opción Diaria</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/nutrition/create-weekoption">Crear Opción Semanal</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/nutrition/create-option">Crear Opción</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/nutrition/assign-option">Asignar Opción</Nav.Link>
                                                </Nav.Item>
                                                <p className="mt-2 mb-1"><strong>Listado</strong></p>
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/nutrition/list-food">Listar Alimentos</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/nutrition/list-ingredient">Listar Ingredientes</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/nutrition/list-dish">Listar Platos</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/nutrition/list-meal">Listar Comidas</Nav.Link>
                                                </Nav.Item>
                                                <p className="mt-2 mb-1"><strong>Adaptar Dietas y Opciones</strong></p>
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/nutrition/adapt-diet-or-option">Adaptar Dieta u Opción</Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header>Deporte</Accordion.Header>
                                        <Accordion.Body>
                                            <Nav className="flex-column">
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/sport/create-exercise">Crear Ejercicio</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/sport/list-exercise">Lista de Ejercicios</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/sport/create-training">Crear Entrenamiento</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link as={NavLink} to="/sport/list-training">Listar Entrenamientos</Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>

                <div className="container mt-4">
                    <Routes>
                        {authToken ? (
                            <>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/search-trainer" element={<SearchTrainer onSearch={handleSearchTrainers} />} />
                                <Route path="/trainer-list" element={<TrainerList trainers={trainers} onSendRequest={handleSendRequest} />} />
                                <Route path="/nutrition" element={<Nutrition />} />
                                <Route path="/sport" element={<Sport />} />
                                <Route path="/nutrition/create-food" element={<CreateFood />} />
                                <Route path="/nutrition/create-ingredient" element={<CreateIngredient />} />
                                <Route path="/nutrition/create-dish" element={<CreateDish />} />
                                <Route path="/nutrition/create-meal" element={<CreateMeal />} />
                                <Route path="/nutrition/create-diet" element={<CreateDiet />} />
                                <Route path="/nutrition/upload-food" element={<UploadFood />} />
                                <Route path="/sport/create-exercise" element={<CreateExercise />} />
                                <Route path="/sport/exercise/:id" element={<ExerciseDetails />} />
                                <Route path="/sport/edit-exercise/:id" element={<EditExercise />} />
                                <Route path="/sport/create-training" element={<CreateTraining />} />
                                <Route path="/nutrition/create-dayoption" element={<CreateDayOption />} />
                                <Route path="/nutrition/create-weekoption" element={<CreateWeekOption />} />
                                <Route path="/nutrition/create-option" element={<CreateOption />} />
                                <Route path="/nutrition/assign-option" element={<AssignOptionToUser />} />
                                <Route path="/nutrition/list-food" element={<ListFood />} />
                                <Route path="/nutrition/foods/:foodId" element={<FoodDetails />} />
                                <Route path="/nutrition/edit-dailydiet/:dietId" element={<ManageDailyDiet />} />
                                <Route path="/nutrition/list-ingredient" element={<ListIngredient />} />
                                <Route path="/nutrition/ingredients/:ingredientId" element={<IngredientDetails />} />
                                <Route path="/nutrition/list-dish" element={<ListDish />} />
                                <Route path="/nutrition/list-meal" element={<ListMeal />} />
                                <Route path="/nutrition/edit-food/:foodId" element={<EditFood />} />
                                <Route path="/nutrition/edit-ingredient/:ingredientId" element={<EditIngredient />} />
                                <Route path="/nutrition/edit-dish/:dishId" element={<EditDish />} />
                                <Route path="/nutrition/edit-meal/:mealId" element={<EditMeal />} />
                                <Route path="/nutrition/edit-diet/:dietId" element={<EditDiet />} />
                                <Route path="/sport/list-exercise" element={<ListExercise />} />
                                <Route path="/sport/edit-training/:id" element={<EditTraining />} />
                                <Route path="/sport/list-training" element={<ListTraining />} />
                                <Route path="/sport/training/:id" element={<TrainingDetails />} />
                                <Route path="/nutrition/adapt-diet-or-option" element={<AdaptDietOrOption />} />
                                <Route path="/trainers" element={<TrainerList trainers={trainers} onSendRequest={handleSendRequest} />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="*" element={<Navigate replace to="/" />} />
                            </>
                        ) : (
                            <>
                                <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                                <Route path="/signup/regularuser" element={<RegularUserSignUp onSignUpSuccess={handleLoginSuccess} />} />
                                <Route path="/signup/trainer" element={<TrainerSignUp onSignUpSuccess={handleLoginSuccess} />} />
                                <Route path="*" element={<Navigate replace to="/login" />} />
                            </>
                        )}
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

function Nutrition() {
    return (
        <div>
            <h2>Nutrición</h2>
            <NavLink to="/nutrition/create-food">Crear Alimento</NavLink><br />
            <NavLink to="/nutrition/create-ingredient">Crear Ingrediente</NavLink><br />
            <NavLink to="/nutrition/create-dish">Crear Plato</NavLink><br />
            <NavLink to="/nutrition/create-meal">Crear Comida</NavLink><br />
            <NavLink to="/nutrition/create-diet">Crear Dieta</NavLink><br />
            <NavLink to="/nutrition/upload-food">Subir Alimento</NavLink><br />
            <NavLink to="/nutrition/create-dayoption">Crear Opción Diaria</NavLink><br />
            <NavLink to="/nutrition/create-weekoption">Crear Opción Semanal</NavLink><br />
            <NavLink to="/nutrition/create-option">Crear Opción</NavLink><br />
            <NavLink to="/nutrition/assign-option">Asignar Opción</NavLink><br />
            <NavLink to="/nutrition/list-ingredient">Listar Ingredientes</NavLink><br />
            <NavLink to="/nutrition/list-food">Listar Alimentos</NavLink><br />
            <NavLink to="/nutrition/edit-food/:id">Editar Alimento</NavLink><br />
            <NavLink to="/nutrition/edit-ingredient/:id">Editar Ingrediente</NavLink><br />
            <NavLink to="/nutrition/edit-dish/:id">Editar Plato</NavLink><br />
            <NavLink to="/nutrition/edit-meal/:id">Editar Comida</NavLink><br />
            <NavLink to="/nutrition/edit-diet/:id">Editar Dieta</NavLink><br />
        </div>
    );
}

function Sport() {
    return (
        <div>
            <h2>Deporte</h2>
            <NavLink to="/sport/create-exercise">Crear Ejercicio</NavLink><br />
            <NavLink to="/sport/exercise/:id">Detalles del Ejercicio</NavLink><br />
            <NavLink to="/sport/edit-exercise/:id">Editar Ejercicio</NavLink><br />
            <NavLink to="/sport/create-training">Crear Entrenamiento</NavLink><br />
            <NavLink to="/sport/list-exercise">Listar Ejercicios</NavLink><br />
            <NavLink to="/sport/edit-training/:id">Editar Entrenamiento</NavLink><br />
            <NavLink to="/sport/list-training">Listar Entrenamientos</NavLink><br />
            <NavLink to="/sport/training/:id">Detalles del Entrenamiento</NavLink><br />
        </div>
    );
}

export default App;
