import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import CreateIngredient from './components/nutrition/CreateIngredient';
import CreateFood from './components/nutrition/CreateFood';
import CreateDish from './components/nutrition/CreateDish';
import CreateMeal from './components/nutrition/CreateMeal';
import CreateDiet from './components/nutrition/CreateDiet';
import ManageDailyDiet from './components/nutrition/ManageDailyDiet';
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

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');

  const handleLoginSuccess = (token) => {
    localStorage.setItem('authToken', token); // Almacenar el token en localStorage para persistencia
    setAuthToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Borrar el token de localStorage
    setAuthToken('');
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              <li><Link to="/nutrition">Nutrition</Link></li>
              <li><Link to="/sport">Sport</Link></li>
              {!authToken && (
                <>
                  <li><Link to="/signup/regularuser">Registrarse como Usuario</Link></li>
                  <li><Link to="/signup/trainer">Registrarse como Entrenador</Link></li>
                </>
                )}
              {authToken ? (
                <li><button onClick={handleLogout}>Logout</button></li> // Botón de logout
              ) : (
                <li><Link to="/login">Login</Link></li> // Link a la página de login
              )}
            </ul>
          </nav>

          <Routes>
            {authToken ? (
              // Rutas protegidas
              <>
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/sport" element={<Sport />} />
                <Route path="/nutrition/create-food" element={<CreateFood />} />
                <Route path="/nutrition/create-ingredient" element={<CreateIngredient />} />
                <Route path="/nutrition/create-dish" element={<CreateDish />} />
                <Route path="/nutrition/create-meal" element={<CreateMeal />} />
                <Route path="/nutrition/create-diet" element={<CreateDiet />} />
                <Route path="/edit-dailydiet/:dietId" element={<ManageDailyDiet />} />
                <Route path="/nutrition/upload-food" element={<UploadFood />} />
                <Route path="/sport/create-exercise" element={<CreateExercise />} />
                <Route path="/sport/exercise/:id" element={<ExerciseDetails />} />
                <Route path="/sport/edit-exercise/:id" element={<EditExercise />} />
                <Route path="/sport/create-training" element={<CreateTraining />} />
                <Route path="/nutrition/create-dayoption" element={<CreateDayOption />} />
                <Route path="/nutrition/create-weekoption" element={<CreateWeekOption />} />
                <Route path="/nutrition/create-option" element={<CreateOption />} />
                <Route path="*" element={<Navigate replace to="/nutrition" />} />
              </>
            ) : (
              // Rutas accesibles sin autenticación
              <>
                <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/signup/regularuser" element={<RegularUserSignUp onSignUpSuccess={handleLoginSuccess} />} />
                <Route path="/signup/trainer" element={<TrainerSignUp onSignUpSuccess={handleLoginSuccess} />} />
                <Route path="*" element={<Navigate replace to="/login" />} />
              </>
            )}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

function Nutrition() {
  return (
    <div>
      <h2>Nutrición</h2>
      <Link to="/nutrition/create-food">Create Food</Link><br />
      <Link to="/nutrition/create-ingredient">Create Ingredient</Link><br />
      <Link to="/nutrition/create-dish">Create Dish</Link><br />
      <Link to="/nutrition/create-meal">Create Meal</Link><br />
      <Link to="/nutrition/create-diet">Create Diet</Link><br />
      <Link to="/edit-dailydiet/:dietId">Edit Daily Diet</Link><br />
      <Link to="/nutrition/upload-food">Upload Food</Link><br />
      <Link to="/nutrition/create-dayoption">Create Day Option</Link><br />
      <Link to="/nutrition/create-weekoption">Create Week Option</Link><br />
      <Link to="/nutrition/create-option">Create Option</Link><br />
    </div>
  );
}

function Sport() {
  return (
    <div>
      <h2>Deporte</h2>
      <Link to="/sport/create-exercise">Create Exercise</Link><br />
      <Link to="/sport/exercise/:id">Exercise Details</Link><br />
      <Link to="/sport/edit-exercise/:id">Edit Exercise</Link><br />
      <Link to="/sport/create-training">Create Training</Link><br />
    </div>
  );
}

export default App;
