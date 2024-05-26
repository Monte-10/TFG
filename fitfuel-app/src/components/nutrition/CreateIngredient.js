import React, { useState, useEffect } from 'react';

function CreateIngredient() {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [name, setName] = useState('');
  const [ingredientCreated, setIngredientCreated] = useState(false);
  const [nutritionalInfo, setNutritionalInfo] = useState({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    name: { value: '', active: true },
    minCalories: { value: '', active: false },
    maxCalories: { value: '', active: false },
    minProtein: { value: '', active: false },
    maxProtein: { value: '', active: false },
    minCarbohydrates: { value: '', active: false },
    maxCarbohydrates: { value: '', active: false },
    minFat: { value: '', active: false },
    maxFat: { value: '', active: false },
    minSugar: { value: '', active: false },
    maxSugar: { value: '', active: false },
    minFiber: { value: '', active: false },
    maxFiber: { value: '', active: false },
    minSaturatedFat: { value: '', active: false },
    maxSaturatedFat: { value: '', active: false },
  });
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/nutrition/foods/`, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setFoods(data);
      });
  }, [apiUrl]);

  useEffect(() => {
    const updatedFoods = foods.filter(food => {
      return Object.entries(filters).every(([key, filter]) => {
        if (!filter.active || filter.value === '') return true;
        const value = parseFloat(filter.value);
        switch (key) {
          case 'name':
            return food.name.toLowerCase().includes(filter.value.toLowerCase());
          case 'minCalories':
            return food.calories >= value;
          case 'maxCalories':
            return food.calories <= value;
          case 'minProtein':
            return food.protein >= value;
          case 'maxProtein':
            return food.protein <= value;
          case 'minCarbohydrates':
            return food.carbohydrates >= value;
          case 'maxCarbohydrates':
            return food.carbohydrates <= value;
          case 'minFat':
            return food.fat >= value;
          case 'maxFat':
            return food.fat <= value;
          case 'minSugar':
            return food.sugar >= value;
          case 'maxSugar':
            return food.sugar <= value;
          case 'minFiber':
            return food.fiber >= value;
          case 'maxFiber':
            return food.fiber <= value;
          case 'minSaturatedFat':
            return food.saturated_fat >= value;
          case 'maxSaturatedFat':
            return food.saturated_fat <= value;
          default:
            return true;
        }
      });
    });
    setFilteredFoods(updatedFoods);
  }, [foods, filters]);

  const handleFilterChange = (name, value) => {
    const isActive = value !== '';
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: { value, active: isActive }
    }));
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const resetFilters = () => {
    setFilters({
      name: { value: '', active: true },
      minCalories: { value: '', active: false },
      maxCalories: { value: '', active: false },
      minProtein: { value: '', active: false },
      maxProtein: { value: '', active: false },
      minCarbohydrates: { value: '', active: false },
      maxCarbohydrates: { value: '', active: false },
      minFat: { value: '', active: false },
      maxFat: { value: '', active: false },
      minSugar: { value: '', active: false },
      maxSugar: { value: '', active: false },
      minFiber: { value: '', active: false },
      maxFiber: { value: '', active: false },
      minSaturatedFat: { value: '', active: false },
      maxSaturatedFat: { value: '', active: false },
    });
    setShowAdvancedFilters(false);  // Optionally reset the visibility
  };

  const handleSelectChange = (event) => {
    const foodId = event.target.value;
    setSelectedFood(foodId);
    const selectedFood = foods.find(food => food.id.toString() === foodId);
    setNutritionalInfo(selectedFood ? selectedFood : {});
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const calculateNutritionalValues = (value, quantity) => {
    if (!value || !quantity) return 0;
    return (value * quantity) / 100;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const ingredientData = {
      name: name,
      food: selectedFood,
      quantity: quantity
    };
    console.log("Submitting ingredient data:", ingredientData);

    fetch(`${apiUrl}/nutrition/ingredients/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingredientData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Ingredient created successfully', data);
      setIngredientCreated(true);
    })
    .catch(error => {
      console.error('Error creating ingredient:', error);
    });
  };

  return (
    <div className="container mt-4">
      <h2>Crear Ingrediente</h2>
      {ingredientCreated && <div className="alert alert-success" role="alert">El Ingrediente ha sido creado con éxito.</div>}
      <form onSubmit={handleSubmit}>
        <h3>Filtros para Ingredientes</h3>
        <div className="row">
          <div className="mb-3">
            <label htmlFor="filterName" className="form-label">Nombre del Alimento</label>
            <input 
              type="text" 
              className="form-control" 
              id="filterName" 
              value={filters.name.value} 
              onChange={e => handleFilterChange('name', e.target.value)} 
            />
          </div>
          <button type="button" className="btn btn-info mb-3" onClick={toggleAdvancedFilters}>
            {showAdvancedFilters ? 'Ocultar Filtros Avanzados' : 'Mostrar Filtros Avanzados'}
          </button>
          {showAdvancedFilters && (
            <>
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="filterMinCalories" className="form-label">Mínimo de Calorías</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMinCalories"
                    value={filters.minCalories.value}
                    onChange={e => handleFilterChange('minCalories', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filterMaxCalories" className="form-label">Máximo de Calorías</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMaxCalories"
                    value={filters.maxCalories.value}
                    onChange={e => handleFilterChange('maxCalories', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filterMinProtein" className="form-label">Mínimo de Proteínas</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMinProtein"
                    value={filters.minProtein.value}
                    onChange={e => handleFilterChange('minProtein', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filterMaxProtein" className="form-label">Máximo de Proteínas</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMaxProtein"
                    value={filters.maxProtein.value}
                    onChange={e => handleFilterChange('maxProtein', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="filterMinCarbohydrates" className="form-label">Mínimo de Carbohidratos</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMinCarbohydrates"
                    value={filters.minCarbohydrates.value}
                    onChange={e => handleFilterChange('minCarbohydrates', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filterMaxCarbohydrates" className="form-label">Máximo de Carbohidratos</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMaxCarbohydrates"
                    value={filters.maxCarbohydrates.value}
                    onChange={e => handleFilterChange('maxCarbohydrates', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filterMinFat" className="form-label">Mínimo de Grasas</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMinFat"
                    value={filters.minFat.value}
                    onChange={e => handleFilterChange('minFat', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filterMaxFat" className="form-label">Máximo de Grasas</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMaxFat"
                    value={filters.maxFat.value}
                    onChange={e => handleFilterChange('maxFat', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="filterMinSugar" className="form-label">Mínimo de Azúcares</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMinSugar"
                    value={filters.minSugar.value}
                    onChange={e => handleFilterChange('minSugar', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filterMaxSugar" className="form-label">Máximo de Azúcares</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMaxSugar"
                    value={filters.maxSugar.value}
                    onChange={e => handleFilterChange('maxSugar', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filterMinFiber" className="form-label">Mínimo de Fibra</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMinFiber"
                    value={filters.minFiber.value}
                    onChange={e => handleFilterChange('minFiber', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="filterMaxFiber" className="form-label">Máximo de Fibra</label>
                  <input
                    type="number"
                    className="form-control"
                    id="filterMaxFiber"
                    value={filters.maxFiber.value}
                    onChange={e => handleFilterChange('maxFiber', e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <button type="button" className="btn btn-secondary" onClick={resetFilters}>Limpiar Filtros</button>

        <hr />
        <h3>Crear Ingrediente</h3>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre del Ingrediente</label>
          <input 
            type="text" 
            className="form-control" 
            id="name" 
            value={name} 
            onChange={e => setName(e.target.value)}
          />

          <label htmlFor="food" className="form-label">Alimento</label>
          <select 
            className="form-select" 
            id="food" 
            value={selectedFood} 
            onChange={handleSelectChange}
          >
            <option value="">Selecciona un alimento</option>
            {filteredFoods.map(food => (
              <option key={food.id} value={food.id}>{food.name}</option>
            ))}
          </select>

          <label htmlFor="quantity" className="form-label">Cantidad (g)</label>
          <input 
            type="number" 
            className="form-control" 
            id="quantity" 
            value={quantity} 
            onChange={handleQuantityChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Crear Ingrediente</button>

        <div className="card mt-4">
          <h3>Información Nutricional</h3>
          <div className="row">
            <div className="col-md-4">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Calorías: {calculateNutritionalValues(nutritionalInfo.calories, quantity)} kcal</li>
                <li className="list-group-item">Proteínas: {calculateNutritionalValues(nutritionalInfo.protein, quantity)} g</li>
                <li className="list-group-item">Carbohidratos: {calculateNutritionalValues(nutritionalInfo.carbohydrates, quantity)} g</li>
                <li className="list-group-item">Grasas: {calculateNutritionalValues(nutritionalInfo.fat, quantity)} g</li>
                <li className="list-group-item">Azúcares: {calculateNutritionalValues(nutritionalInfo.sugar, quantity)} g</li>
                <li className="list-group-item">Fibra: {calculateNutritionalValues(nutritionalInfo.fiber, quantity)} g</li>
                <li className="list-group-item">Grasas Saturadas: {calculateNutritionalValues(nutritionalInfo.saturated_fat, quantity)} g</li>
                <li className="list-group-item">Gluten Free: {nutritionalInfo.gluten_free ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Lactose Free: {nutritionalInfo.lactose_free ? 'Sí' : 'No'}</li>
              </ul>
            </div>
            <div className="col-md-4">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Vegan: {nutritionalInfo.vegan ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Vegetarian: {nutritionalInfo.vegetarian ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Pescetarian: {nutritionalInfo.pescetarian ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Contains Meat: {nutritionalInfo.contains_meat ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Contains Vegetables: {nutritionalInfo.contains_vegetables ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Contains Fish/Shellfish/Canned: {nutritionalInfo.contains_fish_shellfish_canned_preserved ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Cereal: {nutritionalInfo.cereal ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Pasta or Rice: {nutritionalInfo.pasta_or_rice ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Dairy/Yogurt/Cheese: {nutritionalInfo.dairy_yogurt_cheese ? 'Sí' : 'No'}</li>
              </ul>
            </div>
            <div className="col-md-4">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Fruit: {nutritionalInfo.fruit ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Nuts: {nutritionalInfo.nuts ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Legume: {nutritionalInfo.legume ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Sauce or Condiment: {nutritionalInfo.sauce_or_condiment ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Deli Meat: {nutritionalInfo.deli_meat ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Bread or Toast: {nutritionalInfo.bread_or_toast ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Egg: {nutritionalInfo.egg ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Special Drink or Supplement: {nutritionalInfo.special_drink_or_supplement ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Tuber: {nutritionalInfo.tuber ? 'Sí' : 'No'}</li>
                <li className="list-group-item">Other: {nutritionalInfo.other ? 'Sí' : 'No'}</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateIngredient;
