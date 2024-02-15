import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateIngredient from './components/nutrition/CreateIngredient';
import CreateFood from './components/nutrition/CreateFood';
import CreateDish from './components/nutrition/CreateDish';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              <li>
                <Link to="/nutrition">Nutrition</Link>
              </li>
              <li>
                <Link to="/sport">Sport</Link>
              </li>
            </ul>
          </nav>

          {/* Aquí se configuran las rutas */}
          <Routes>
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/sport" element={<Sport />} />
            <Route path="/nutrition/create-food" element={<CreateFood />} />
            <Route path="/nutrition/create-ingredient" element={<CreateIngredient />} />
            <Route path="/nutrition/create-dish" element={<CreateDish />} />
            {/* Añadir más rutas según sea necesario */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

function Nutrition() {
  return (
    <div>
      <h2>Nutrition</h2>
      <Link to="/nutrition/create-food">Create Food</Link><br/>
      <Link to="/nutrition/create-ingredient">Create Ingredient</Link>
      <Link to="/nutrition/create-dish">Create Dish</Link>
    </div>
  );
}

// Componente de placeholder para Sport
function Sport() {
  return <h2>Sport</h2>;
}

export default App;
