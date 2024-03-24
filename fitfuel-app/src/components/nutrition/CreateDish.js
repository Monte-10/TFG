import React, { useState } from 'react';
import { useEffect } from 'react';

function CreateDish() {
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [nutritionTotals, setNutritionTotals] = useState({
        calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, fiber: 0, saturated_fat: 0,
        gluten_free: true, lactose_free: true, vegan: true, vegetarian: true, pescetarian: true,
        contains_meat: false, contains_vegetables: false, contains_fish_shellfish_canned_preserved: false,
        cereal: false, pasta_or_rice: false, dairy_yogurt_cheese: false, fruit: false, nuts: false,
        legume: false, sauce_or_condiment: false, deli_meat: false, bread_or_toast: false, egg: false,
        special_drink_or_supplement: false, tuber: false, other: false
    });
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [name, setName] = useState('');
    const [dishCreated, setDishCreated] = useState(false);
    const [createdDishId, setCreatedDishId] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/nutrition/ingredients/')
            .then(response => response.json())
            .then(data => setIngredients(data));

        fetch('http://127.0.0.1:8000/user/regularusers/')
            .then(response => response.json())
            .then(data => {
                setUsers(data);
                if (data.length > 0) {
                    setSelectedUser(data[0].id.toString());
                }
            });
    }, []);

    useEffect(() => {
        const initialTotals = {
            calories: 0,
            protein: 0,
            carbohydrates: 0,
            fat: 0,
            sugar: 0,
            fiber: 0,
            saturated_fat: 0,
            gluten_free: true,
            lactose_free: true,
            vegan: true,
            vegetarian: true,
            pescetarian: true,
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
            other: false
        };
    
        const totals = selectedIngredients.reduce((acc, { ingredientId, quantity }) => {
            const ingredient = ingredients.find(ing => ing.id.toString() === ingredientId);
            if (ingredient && quantity) {
                acc.calories += ingredient.calories * quantity;
                acc.protein += ingredient.protein * quantity;
                acc.carbohydrates += ingredient.carbohydrates * quantity;
                acc.fat += ingredient.fat * quantity;
                acc.sugar += ingredient.sugar * quantity;
                acc.fiber += ingredient.fiber * quantity;
                acc.saturated_fat += ingredient.saturated_fat * quantity;
                acc.gluten_free = acc.gluten_free && ingredient.gluten_free;
                acc.lactose_free = acc.lactose_free && ingredient.lactose_free;
                acc.vegan = acc.vegan && ingredient.vegan;
                acc.vegetarian = acc.vegetarian && ingredient.vegetarian;
                acc.pescetarian = acc.pescetarian && ingredient.pescetarian;
                acc.contains_meat = acc.contains_meat || ingredient.contains_meat;
                acc.contains_vegetables = acc.contains_vegetables || ingredient.contains_vegetables;
                acc.contains_fish_shellfish_canned_preserved = acc.contains_fish_shellfish_canned_preserved || ingredient.contains_fish_shellfish_canned_preserved;
                acc.cereal = acc.cereal || ingredient.cereal;
                acc.pasta_or_rice = acc.pasta_or_rice || ingredient.pasta_or_rice;
                acc.dairy_yogurt_cheese = acc.dairy_yogurt_cheese || ingredient.dairy_yogurt_cheese;
                acc.fruit = acc.fruit || ingredient.fruit;
                acc.nuts = acc.nuts || ingredient.nuts;
                acc.legume = acc.legume || ingredient.legume;
                acc.sauce_or_condiment = acc.sauce_or_condiment || ingredient.sauce_or_condiment;
                acc.deli_meat = acc.deli_meat || ingredient.deli_meat;
                acc.bread_or_toast = acc.bread_or_toast || ingredient.bread_or_toast;
                acc.egg = acc.egg || ingredient.egg;
                acc.special_drink_or_supplement = acc.special_drink_or_supplement || ingredient.special_drink_or_supplement;
                acc.tuber = acc.tuber || ingredient.tuber;
                acc.other = acc.other || ingredient.other;
            }
            return acc;
        }, initialTotals);
    
        setNutritionTotals(totals);
    }, [selectedIngredients, ingredients]);
    

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = selectedIngredients.map((ingredient, i) => {
            if (i === index) {
                return { ...ingredient, [field]: field === 'quantity' ? parseFloat(value) : value };
            }
            return ingredient;
        });
        setSelectedIngredients(updatedIngredients);
    };

    const addIngredientField = () => {
        setSelectedIngredients([...selectedIngredients, { ingredientId: '', quantity: 0 }]);
    };

    const removeIngredientField = (index) => {
        setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Preparar los datos del formulario para el envío
        const dishData = {
            name,
            user: selectedUser,
            ingredients: selectedIngredients.filter(si => si.ingredientId && si.quantity).map(si => ({
                ingredient: si.ingredientId,
                quantity: parseFloat(si.quantity), // Asegúrate de enviar la cantidad como un número
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
                // Manejar posibles errores de respuesta HTTP
                const message = `Error en la respuesta: ${response.status}`;
                throw new Error(message);
            }
            
            const data = await response.json();
            console.log('Plato creado con éxito:', data);
            // Manejo post-creación: mostrar mensaje de éxito, resetear formulario, etc.
            setDishCreated(true);
            setCreatedDishId(data.id); // Suponiendo que la API retorna el ID del plato creado
            setName('');
            setSelectedUser('');
            setSelectedIngredients([{ ingredientId: '', quantity: 0 }]);
        } catch (error) {
            console.error('Error al crear el plato:', error);
            // Manejar UI de error, mostrar mensaje al usuario, etc.
        }
    };

    return (
      <div className="container mt-4">
          <h2 className="mb-4">Crear Plato</h2>
          {dishCreated && (
              <div className="alert alert-success" role="alert">
                  El Plato ha sido creado con éxito. ID: {createdDishId}
                  <button onClick={() => setDishCreated(false)} className="btn btn-outline-secondary ml-2">Crear otro plato</button>
              </div>
          )}

          {!dishCreated && (
              <form onSubmit={handleSubmit} className="needs-validation" novalidate>
                  <div className="form-group mb-3">
                      <label htmlFor="dishName">Nombre del Plato:</label>
                      <input type="text" className="form-control" id="dishName" value={name} onChange={(e) => setName(e.target.value)} required />
                      <div className="invalid-feedback">Por favor, ingrese un nombre para el plato.</div>
                  </div>

                  <div className="form-group mb-3">
                      <label htmlFor="userSelect">Usuario:</label>
                      <select className="form-control" id="userSelect" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
                          <option value="">Seleccione un usuario</option>
                          {users.map((user) => (
                              <option key={user.id} value={user.id}>{user.username}</option>
                          ))}
                      </select>
                  </div>

                  {selectedIngredients.map((ingredient, index) => (
                      <div key={index} className="input-group mb-3">
                          <select className="form-select" value={ingredient.ingredientId} onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)} required>
                              <option value="">Seleccione un ingrediente</option>
                              {ingredients.map((ing) => (
                                  <option key={ing.id} value={ing.id}>{ing.name}</option>
                              ))}
                          </select>
                          <input type="number" className="form-control" placeholder="Cantidad" value={ingredient.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} />
                          <div className="input-group-append">
                              <button type="button" className="btn btn-outline-danger" onClick={() => removeIngredientField(index)}>Eliminar</button>
                          </div>
                      </div>
                  ))}

                  <div className="d-flex justify-content-between">
                      <button type="button" className="btn btn-outline-info mb-3" onClick={addIngredientField}>Añadir Ingrediente</button>
                      <button type="submit" className="btn btn-primary">Crear Plato</button>
                  </div>
              </form>
          )}

<div className="card mt-4">
    <div className="card-header">
        Totales Nutricionales
    </div>
    <ul className="list-group list-group-flush">
        <li className="list-group-item">Calorías: {nutritionTotals.calories.toFixed(2)}</li>
        <li className="list-group-item">Proteínas: {nutritionTotals.protein.toFixed(2)}g</li>
        <li className="list-group-item">Carbohidratos: {nutritionTotals.carbohydrates.toFixed(2)}g</li>
        <li className="list-group-item">Grasas: {nutritionTotals.fat.toFixed(2)}g</li>
        <li className="list-group-item">Azúcares: {nutritionTotals.sugar.toFixed(2)}g</li>
        <li className="list-group-item">Fibra: {nutritionTotals.fiber.toFixed(2)}g</li>
        <li className="list-group-item">Grasas Saturadas: {nutritionTotals.saturated_fat.toFixed(2)}g</li>
        <li className="list-group-item">Libre de Gluten: {nutritionTotals.gluten_free ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Libre de Lactosa: {nutritionTotals.lactose_free ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Vegano: {nutritionTotals.vegan ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Vegetariano: {nutritionTotals.vegetarian ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Pescetariano: {nutritionTotals.pescetarian ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Contiene Carne: {nutritionTotals.contains_meat ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Contiene Vegetales: {nutritionTotals.contains_vegetables ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Contiene Pescado/Mariscos: {nutritionTotals.contains_fish_shellfish_canned_preserved ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Cereal: {nutritionTotals.cereal ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Pasta o Arroz: {nutritionTotals.pasta_or_rice ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Lácteos (Yogur, Queso): {nutritionTotals.dairy_yogurt_cheese ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Fruta: {nutritionTotals.fruit ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Frutos Secos: {nutritionTotals.nuts ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Legumbres: {nutritionTotals.legume ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Salsa o Condimento: {nutritionTotals.sauce_or_condiment ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Fiambre: {nutritionTotals.deli_meat ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Pan o Tostadas: {nutritionTotals.bread_or_toast ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Huevo: {nutritionTotals.egg ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Bebida Especial o Suplemento: {nutritionTotals.special_drink_or_supplement ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Tubérculo: {nutritionTotals.tuber ? 'Sí' : 'No'}</li>
        <li className="list-group-item">Otro: {nutritionTotals.other ? 'Sí' : 'No'}</li>
            </ul>
            </div>
        </div>
    );
}
        
export default CreateDish;