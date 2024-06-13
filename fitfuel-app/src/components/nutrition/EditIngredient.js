import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditIngredient.css';

function EditIngredient() {
  const { ingredientId } = useParams();
  const navigate = useNavigate();
  const [ingredient, setIngredient] = useState(null);
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Cargar la información existente del ingrediente
    fetch(`${apiUrl}/nutrition/ingredients/${ingredientId}/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setIngredient(data);
      })
      .catch(error => {
        console.error('Error fetching ingredient details:', error);
        setError('Error cargando los detalles del ingrediente.');
      });

    // Cargar lista de alimentos para el selector
    fetch(`${apiUrl}/nutrition/foods/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => response.json())
      .then(setFoods)
      .catch(error => {
        console.error('Error fetching foods:', error);
      });
  }, [ingredientId, apiUrl]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setIngredient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`${apiUrl}/nutrition/ingredients/${ingredientId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(ingredient)
    })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      navigate(`/nutrition/ingredients/`);  // Redirigir a la lista de ingredientes o detalles
    })
    .catch(error => {
      console.error('Error updating ingredient:', error);
      setError('Error al actualizar el ingrediente.');
    });
  };

  const handleDuplicate = (event) => {
    event.preventDefault();

    fetch(`${apiUrl}/nutrition/ingredients/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          name: ingredient.name,
          food: ingredient.food,
          quantity: ingredient.quantity
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Error: ${response.status} - ${JSON.stringify(errorData)}`);
            });
        }
        return response.json();
    })
    .then(newIngredient => {
        console.log('Nuevo ingrediente creado:', newIngredient);
        navigate(`/nutrition/ingredients/${newIngredient.id}`); // Navegar al nuevo ingrediente creado
    })
    .catch(error => {
        console.error('Error duplicando el ingrediente:', error);
        setError(`Error al duplicar el ingrediente: ${error.message}`);
    });
};


  if (!ingredient) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container-editingredient mt-5">
      <h2 className="mb-4">Editar Ingrediente</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre del Ingrediente</label>
          <input 
            type="text" 
            className="form-control" 
            id="name" 
            name="name" 
            value={ingredient.name || ''} 
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="food" className="form-label">Alimento</label>
          <select 
            className="form-select" 
            id="food" 
            name="food"
            value={ingredient.food || ''} 
            onChange={handleChange}
          >
            <option value="">Selecciona un alimento</option>
            {foods.map(food => (
              <option key={food.id} value={food.id}>{food.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Cantidad (g)</label>
          <input 
            type="number" 
            className="form-control" 
            id="quantity" 
            name="quantity"
            value={ingredient.quantity || 0} 
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Actualizar Ingrediente</button>
        <button type="button" className="btn btn-secondary mt-3 ml-2" onClick={handleDuplicate}>Duplicar Ingrediente</button>

      </form>
    </div>
  );
}

export default EditIngredient;
