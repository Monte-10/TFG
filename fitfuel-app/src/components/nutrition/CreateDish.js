import React, { useState, useEffect } from 'react';

function CreateDish() {
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredientIds, setSelectedIngredientIds] = useState([]);
    const [newIngredients, setNewIngredients] = useState([]);
    const [dishName, setDishName] = useState('');
    const [foods, setFoods] = useState([]);
    const [selectedFoodForNewIngredient, setSelectedFoodForNewIngredient] = useState('');
    const [newIngredientName, setNewIngredientName] = useState('');
    const [newIngredientQuantity, setNewIngredientQuantity] = useState('');
    const userId = "ID_DEL_USUARIO"; // Asegúrate de obtener este valor correctamente, por ejemplo, desde el estado global, contexto, etc.

    useEffect(() => {
        fetch('http://127.0.0.1:8000/nutrition/ingredients/')
            .then(response => response.json())
            .then(data => setIngredients(data));

        fetch('http://127.0.0.1:8000/nutrition/foods/')
            .then(response => response.json())
            .then(data => setFoods(data));
    }, []);

    const handleAddIngredient = () => {
        const newIngredient = {
            name: newIngredientName,
            quantity: parseFloat(newIngredientQuantity), // Asegúrate de convertir la cantidad a número
            food: selectedFoodForNewIngredient,
        };
        setNewIngredients([...newIngredients, newIngredient]);
        setNewIngredientName('');
        setNewIngredientQuantity('');
        setSelectedFoodForNewIngredient('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dishData = {
            name: dishName,
            user: parseInt(userId, 8), // Convierte el userId a número
            dish_ingredients: selectedIngredientIds.map(id => ({
                ingredient: id,
                quantity: 1, // Define una cantidad predeterminada o ajusta según tu caso de uso
            })).concat(newIngredients),
        };

        console.log('Creating dish:', dishData);

        fetch('http://127.0.0.1:8000/nutrition/dishes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dishData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error('Error creating dish: ' + JSON.stringify(error));
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Dish created successfully:', data);
            alert('Dish created successfully!');
        })
        .catch(error => {
            console.error('Error creating dish:', error);
            alert(error.message);
        });
    };
    
    

    return (
        <div>
            <h2>Create Dish</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Dish Name:
                    <input
                        type="text"
                        value={dishName}
                        onChange={(e) => setDishName(e.target.value)}
                    />
                </label>
                <h3>Select Existing Ingredients</h3>
                {ingredients.map((ingredient) => (
                    <div key={ingredient.id}>
                        <input
                            type="checkbox"
                            value={ingredient.id}
                            checked={selectedIngredientIds.includes(ingredient.id)}
                            onChange={(e) => {
                                const id = parseInt(e.target.value, 10);
                                setSelectedIngredientIds(e.target.checked
                                    ? [...selectedIngredientIds, id]
                                    : selectedIngredientIds.filter(i => i !== id));
                            }}
                        />
                        {ingredient.name}
                    </div>
                ))}
                <h3>Or Add New Ingredient</h3>
                <label>
                    Food:
                    <select value={selectedFoodForNewIngredient} onChange={(e) => setSelectedFoodForNewIngredient(e.target.value)}>
                        <option value="">Select a Food</option>
                        {foods.map((food) => (
                            <option key={food.id} value={food.id}>{food.name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Name:
                    <input
                        type="text"
                        value={newIngredientName}
                        onChange={(e) => setNewIngredientName(e.target.value)}
                    />
                </label>
                <label>
                    Quantity:
                    <input
                        type="number"
                        value={newIngredientQuantity}
                        onChange={(e) => setNewIngredientQuantity(e.target.value)}
                    />
                </label>
                <button type="button" onClick={handleAddIngredient}>Add New Ingredient</button>
                <button type="submit">Create Dish</button>
            </form>
        </div>
    );
}

export default CreateDish;
