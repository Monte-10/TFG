import React, { useState, useEffect } from 'react';

function CreateDish() {
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState({});
    const [regularUsers, setRegularUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [dishName, setDishName] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:8000/nutrition/ingredients/')
            .then(response => response.json())
            .then(data => setIngredients(data));

        fetch('http://127.0.0.1:8000/user/regularusers/')
            .then(response => response.json())
            .then(data => setRegularUsers(data));
    }, []);

    const handleIngredientChange = (ingredientId, isChecked) => {
        setSelectedIngredients(prev => {
            const newSelection = { ...prev };
            if (isChecked) {
                newSelection[ingredientId] = ''; // Initialize with empty quantity
            } else {
                delete newSelection[ingredientId];
            }
            return newSelection;
        });
    };

    const handleQuantityChange = (ingredientId, quantity) => {
        setSelectedIngredients(prev => ({
            ...prev,
            [ingredientId]: quantity
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dishIngredientsData = Object.keys(selectedIngredients)
            .filter(id => selectedIngredients[id]) // Filter out unchecked or empty quantities
            .map(id => ({
                ingredient: parseInt(id, 10),
                quantity: parseFloat(selectedIngredients[id])
            }));

        const dishData = {
            name: dishName,
            user: selectedUser,
            dish_ingredients: dishIngredientsData,
        };

        fetch('http://127.0.0.1:8000/nutrition/dishes/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dishData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Dish created successfully:', data);
            alert('Dish created successfully!');
            // Reset form or redirect as needed
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
                <label>
                    Select User:
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="">Select a Regular User</option>
                        {regularUsers.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </label>
                <h3>Select Ingredients and Quantities</h3>
                {ingredients.map(ingredient => (
                    <div key={ingredient.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedIngredients.hasOwnProperty(ingredient.id)}
                                onChange={(e) => handleIngredientChange(ingredient.id, e.target.checked)}
                            />
                            {ingredient.name}
                        </label>
                        {selectedIngredients.hasOwnProperty(ingredient.id) && (
                            <input
                                type="number"
                                min="0"
                                placeholder="Quantity"
                                value={selectedIngredients[ingredient.id]}
                                onChange={(e) => handleQuantityChange(ingredient.id, e.target.value)}
                            />
                        )}
                    </div>
                ))}
                <button type="submit">Create Dish</button>
            </form>
        </div>
    );
}

export default CreateDish;
