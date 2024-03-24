import React, { useState, useEffect } from 'react';

function CreateDish() {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([{ ingredientId: '', quantity: 0 }]);
  const [nutritionTotals, setNutritionTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [name, setName] = useState('');
  const [dishCreated, setDishCreated] = useState(false);
  const [createdDishId, setCreatedDishId] = useState(null);

  // Cargar ingredientes y usuarios al inicializar
  useEffect(() => {
    // Carga de ingredientes
    fetch('http://127.0.0.1:8000/nutrition/ingredients/')
      .then(response => response.json())
      .then(data => setIngredients(data));
    // Carga de usuarios
    fetch('http://127.0.0.1:8000/user/regularusers/')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        if (data.length > 0) {
          setSelectedUser(data[0].id.toString());
        }
      });
  }, []);

  // Actualización de los totales nutricionales
  useEffect(() => {
    const newTotals = { 
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      sugar: 0,
      fiber: 0,
      fat: 0,
      saturated_fat: 0,
      gluten_free: false,
      lactose_free: false,
      vegan: false,
      vegetarian: false,
      pescetarian: false,
      contains_meat: false,
      contains_vegetables: false,
      contains_fish_shellfish_canned_preserved: false,
      cereal: false,
      pasta_or_rice: false,
      dairy_yogurt_cheese: false,
      fruit: false,
      nuts: false,
      legume: false,
      sauce_or_condiment: false,
      deli_meat: false,
      bread_or_toast: false,
      egg: false,
      special_drink_or_supplement: false,
      tuber: false,
      other: false,
    };
    selectedIngredients.forEach(({ ingredientId, quantity }) => {
      const ingredient = ingredients.find(ing => ing.id === ingredientId);
      if (ingredient && quantity) {
        newTotals.calories += (ingredient.calories * quantity) / 100;
        newTotals.protein += (ingredient.protein * quantity) / 100;
        newTotals.carbohydrates += (ingredient.carbohydrates * quantity) / 100;
        newTotals.sugar += (ingredient.sugar * quantity) / 100;
        newTotals.fiber += (ingredient.fiber * quantity) / 100;
        newTotals.fat += (ingredient.fat * quantity) / 100;
        newTotals.saturated_fat += (ingredient.saturated_fat * quantity) / 100;
        newTotals.gluten_free = newTotals.gluten_free || ingredient.gluten_free;
        newTotals.lactose_free = newTotals.lactose_free || ingredient.lactose_free;
        newTotals.vegan = newTotals.vegan || ingredient.vegan;
        newTotals.vegetarian = newTotals.vegetarian || ingredient.vegetarian;
        newTotals.pescetarian = newTotals.pescetarian || ingredient.pescetarian;
        newTotals.contains_meat = newTotals.contains_meat || ingredient.contains_meat;
        newTotals.contains_vegetables = newTotals.contains_vegetables || ingredient.contains_vegetables;
        newTotals.contains_fish_shellfish_canned_preserved = newTotals.contains_fish_shellfish_canned_preserved || ingredient.contains_fish_shellfish_canned_preserved;
        newTotals.cereal = newTotals.cereal || ingredient.cereal;
        newTotals.pasta_or_rice = newTotals.pasta_or_rice || ingredient.pasta_or_rice;
        newTotals.dairy_yogurt_cheese = newTotals.dairy_yogurt_cheese || ingredient.dairy_yogurt_cheese;
        newTotals.fruit = newTotals.fruit || ingredient.fruit;
        newTotals.nuts = newTotals.nuts || ingredient.nuts;
        newTotals.legume = newTotals.legume || ingredient.legume;
        newTotals.sauce_or_condiment = newTotals.sauce_or_condiment || ingredient.sauce_or_condiment;
        newTotals.deli_meat = newTotals.deli_meat || ingredient.deli_meat;
        newTotals.bread_or_toast = newTotals.bread_or_toast || ingredient.bread_or_toast;
        newTotals.egg = newTotals.egg || ingredient.egg;
        newTotals.special_drink_or_supplement = newTotals.special_drink_or_supplement || ingredient.special_drink_or_supplement;
        newTotals.tuber = newTotals.tuber || ingredient.tuber;
        newTotals.other = newTotals.other || ingredient.other;
      }
    });
    setNutritionTotals(newTotals);
  }, [selectedIngredients, ingredients]);

  // Manejo de cambios en los ingredientes
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...selectedIngredients];
    updatedIngredients[index][field] = value;
    setSelectedIngredients(updatedIngredients);
  };

  // Añadir y eliminar campos de ingredientes
  const addIngredientField = () => {
    setSelectedIngredients([...selectedIngredients, { ingredientId: '', quantity: 0 }]);
  };

  const removeIngredientField = (index) => {
    const updatedIngredients = [...selectedIngredients];
    updatedIngredients.splice(index, 1);
    setSelectedIngredients(updatedIngredients);
  };

  // Envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Preparar los datos del formulario para el envío
    const dishData = {
      name: name,
      user: selectedUser,
      ingredients: selectedIngredients.filter(si => si.ingredientId && si.quantity).map(si => ({
        ingredient: si.ingredientId,
        quantity: si.quantity,
      })),
    };
  
    console.log("Enviando datos del plato:", dishData);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/nutrition/dishes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dishData),
      });
  
      if (!response.ok) {
        throw new Error('La respuesta de la red no fue ok.');
      }
  
      const data = await response.json();
      console.log('Éxito:', data);
      // Ajusta según necesidades, por ejemplo, actualizar el estado para reflejar la creación exitosa
      setDishCreated(true);
      setCreatedDishId(data.id); // Asume que tu API devuelve el ID del plato creado
  
      // Resetear el formulario o redirigir al usuario
      // Por ejemplo, limpiar el formulario:
      setName('');
      setSelectedUser('');
      setSelectedIngredients([{ ingredientId: '', quantity: '' }]);
    } catch (error) {
      console.error('Error:', error);
      // Manejar errores, por ejemplo, mostrar un mensaje al usuario
    }
  };
  
return (
    <div className="container mt-4">
        {dishCreated ? (
            <div className="alert alert-success">
                <p>El Plato se ha creado correctamente.</p>
                <a href={`/dishes/${createdDishId}`} className="btn btn-primary">Ir a verlo</a>
                <button onClick={() => setDishCreated(false)} className="btn btn-secondary ml-2">Crear otro plato</button>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="form-group">
                    <label htmlFor="dishName">Nombre del Plato:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="dishName"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="userSelect">Usuario:</label>
                    <select
                        className="form-control"
                        id="userSelect"
                        value={selectedUser}
                        onChange={e => setSelectedUser(e.target.value)}
                        >
                        <option value="">Seleccione un usuario</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </div>
                {selectedIngredients.map((ingredient, index) => (
                    <div key={index} className="form-row align-items-center mb-2">
                        <div className="col">
                            <select
                                className="form-control"
                                value={ingredient.ingredientId}
                                onChange={e => handleIngredientChange(index, 'ingredientId', e.target.value)}
                            >
                                <option value="">Seleccione un ingrediente</option>
                                {ingredients.map(ing => (
                                    <option key={ing.id} value={ing.id}>{ing.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Cantidad"
                                value={ingredient.quantity}
                                onChange={e => handleIngredientChange(index, 'quantity', e.target.value)}
                            />
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn btn-danger" onClick={() => removeIngredientField(index)}>Eliminar</button>
                        </div>
                    </div>
                ))}
                <button type="button" className="btn btn-info mb-3" onClick={addIngredientField}>Añadir Ingrediente</button>
                <button type="submit" className="btn btn-primary">Crear Plato</button>
            </form>
        )}
    
        <div className="nutrition-totals">
            <h4>Totales Nutricionales:</h4>
            <p>Calorías: {nutritionTotals.calories ? nutritionTotals.calories.toFixed(2) : '0'}</p>
            <p>Proteínas: {nutritionTotals.protein ? nutritionTotals.protein.toFixed(2) : '0'}g</p>
            <p>Carbohidratos: {nutritionTotals.carbs ? nutritionTotals.carbs.toFixed(2) : '0'}g</p>
            <p>Grasas: {nutritionTotals.fat ? nutritionTotals.fat.toFixed(2) : '0'}g</p>
            <p>Azúcar: {nutritionTotals.sugar ? nutritionTotals.sugar.toFixed(2) : '0'}g</p>
            <p>Fibra: {nutritionTotals.fiber ? nutritionTotals.fiber.toFixed(2) : '0'}g</p>
            <p>Grasas saturadas: {nutritionTotals.saturated_fat ? nutritionTotals.saturated_fat.toFixed(2) : '0'}g</p>
            <p>Libre de gluten: {nutritionTotals.gluten_free ? 'Sí' : 'No'}</p>
            <p>Libre de lactosa: {nutritionTotals.lactose_free ? 'Sí' : 'No'}</p>
            <p>Vegano: {nutritionTotals.vegan ? 'Sí' : 'No'}</p>
            <p>Vegetariano: {nutritionTotals.vegetarian ? 'Sí' : 'No'}</p>
            <p>Pescetariano: {nutritionTotals.pescetarian ? 'Sí' : 'No'}</p>
            <p>Contiene carne: {nutritionTotals.contains_meat ? 'Sí' : 'No'}</p>
            <p>Contiene vegetales: {nutritionTotals.contains_vegetables ? 'Sí' : 'No'}</p>
            <p>Contiene pescado/mariscos/conservas: {nutritionTotals.contains_fish_shellfish_canned_preserved ? 'Sí' : 'No'}</p>
            <p>Cereal: {nutritionTotals.cereal ? 'Sí' : 'No'}</p>
            <p>Pasta o arroz: {nutritionTotals.pasta_or_rice ? 'Sí' : 'No'}</p>
            <p>Lácteos (yogur, queso): {nutritionTotals.dairy_yogurt_cheese ? 'Sí' : 'No'}</p>
            <p>Fruta: {nutritionTotals.fruit ? 'Sí' : 'No'}</p>
            <p>Nueces: {nutritionTotals.nuts ? 'Sí' : 'No'}</p>
            <p>Legumbre: {nutritionTotals.legume ? 'Sí' : 'No'}</p>
            <p>Salsa o condimento: {nutritionTotals.sauce_or_condiment ? 'Sí' : 'No'}</p>
            <p>Embutido: {nutritionTotals.deli_meat ? 'Sí' : 'No'}</p>
            <p>Pan o tostada: {nutritionTotals.bread_or_toast ? 'Sí' : 'No'}</p>
            <p>Huevo: {nutritionTotals.egg ? 'Sí' : 'No'}</p>
            <p>Bebida especial o suplemento: {nutritionTotals.special_drink_or_supplement ? 'Sí' : 'No'}</p>
            <p>Tubérculo: {nutritionTotals.tuber ? 'Sí' : 'No'}</p>
            <p>Otro: {nutritionTotals.other ? 'Sí' : 'No'}</p>
        </div>
    </div>
);
}

export default CreateDish;