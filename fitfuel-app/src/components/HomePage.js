import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="container mt-4">
            <h1>Bienvenido a FitFuelBalance</h1>
            <p>Elige una de las opciones a continuación para comenzar:</p>
            <div className="row">
                <div className="col-md-4">
                    <h3>Nutrición</h3>
                    <ul>
                        <li><Link to="/nutrition/create-food">Crear Alimento</Link></li>
                        <li><Link to="/nutrition/create-ingredient">Crear Ingrediente</Link></li>
                        <li><Link to="/nutrition/create-dish">Crear Plato</Link></li>
                        <li><Link to="/nutrition/create-meal">Crear Comida</Link></li>
                        <li><Link to="/nutrition/create-diet">Crear Dieta</Link></li>
                        <li><Link to="/nutrition/upload-food">Subir Alimento</Link></li>
                        <li><Link to="/nutrition/create-dayoption">Crear Opción Diaria</Link></li>
                        <li><Link to="/nutrition/create-weekoption">Crear Opción Semanal</Link></li>
                        <li><Link to="/nutrition/create-option">Crear Opción</Link></li>
                        <li><Link to="/nutrition/assign-option">Asignar Opción</Link></li>
                        <li><Link to="/nutrition/adapt-option">Adaptar Opción</Link></li> {/* Nuevo enlace agregado */}
                        <li><Link to="/nutrition/list-food">Listar Alimentos</Link></li>
                        <li><Link to="/nutrition/list-ingredient">Listar Ingredientes</Link></li>
                        <li><Link to="/nutrition/list-dish">Listar Platos</Link></li>
                        <li><Link to="/nutrition/list-meal">Listar Comidas</Link></li>
                    </ul>
                </div>
                <div className="col-md-4">
                    <h3>Deporte</h3>
                    <ul>
                        <li><Link to="/sport/create-exercise">Crear Ejercicio</Link></li>
                        <li><Link to="/sport/list-exercise">Listar Ejercicios</Link></li>
                        <li><Link to="/sport/create-training">Crear Entrenamiento</Link></li>
                        <li><Link to="/sport/list-training">Listar Entrenamientos</Link></li>
                        <li><Link to="/sport/create-week-training">Crear Entrenamiento Semanal</Link></li>
                        <li><Link to="/sport/assign-week-training">Asignar Entrenamiento Semanal</Link></li>
                        <li><Link to="/sport/assigned-week-trainings">Entrenamientos Semanales Asignados</Link></li>
                    </ul>
                </div>
                <div className="col-md-4">
                    <h3>Entrenadores</h3>
                    <ul>
                        <li><Link to="/trainer-list">Listar Entrenadores</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
