import React, { useState, useEffect } from 'react';

function CreateIngredient() {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [name, setName] = useState('');
  const [ingredientCreated, setIngredientCreated] = useState(false);
  const [nutritionalInfo, setNutritionalInfo] = useState({});

  useEffect(() => {
    // Aquí deberías reemplazar la URL por la de tu API real
    fetch('http://127.0.0.1:8000/nutrition/foods/')
      .then(response => response.json())
      .then(data => {
        setFoods(data);
      });
  }, []);

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

    // Aquí deberías reemplazar la URL por la de tu API real y ajustar el manejo según tu API
    fetch('http://127.0.0.1:8000/nutrition/ingredients/', {
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
        <h2>Create Ingredient</h2>
        {ingredientCreated && <p>El Ingrediente ha sido creado con éxito.</p>}
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre del Ingrediente</label>
                <input type="text" className="form-control" id="name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="food" className="form-label">Alimento</label>
                <select className="form-select" id="food" value={selectedFood} onChange={handleSelectChange}>
                    <option value="">Seleccione un alimento</option>
                    {foods.map(food => (
                        <option key={food.id} value={food.id}>{food.name}</option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="quantity" className="form-label">Cantidad (en gramos)</label>
                <input type="number" className="form-control" id="quantity" value={quantity} onChange={handleQuantityChange} />
            </div>
            <button type="submit" className="btn btn-primary">Crear Ingrediente</button>
        </form>
        {selectedFood && (
            <div className="mt-4">
                <h3>Valores Nutricionales:</h3>
                <p>Calorías: {calculateNutritionalValues(nutritionalInfo.calories, quantity).toFixed(2)}</p>
                <p>Proteínas: {calculateNutritionalValues(nutritionalInfo.protein, quantity).toFixed(2)}</p>
                <p>Carbohidratos: {calculateNutritionalValues(nutritionalInfo.carbohydrates, quantity).toFixed(2)}</p>
                <p>Grasas: {calculateNutritionalValues(nutritionalInfo.fat, quantity).toFixed(2)}</p>
                <p>Azúcar: {calculateNutritionalValues(nutritionalInfo.sugar, quantity).toFixed(2)}</p>
                <p>Fibra: {calculateNutritionalValues(nutritionalInfo.fiber, quantity).toFixed(2)}</p>
                <p>Grasas Saturadas: {calculateNutritionalValues(nutritionalInfo.saturated_fat, quantity).toFixed(2)}</p>
                <p>Libre de Gluten: {nutritionalInfo.gluten_free ? 'Sí' : 'No'}</p>
                <p>Libre de Lactosa: {nutritionalInfo.lactose_free ? 'Sí' : 'No'}</p>
                <p>Vegano: {nutritionalInfo.vegan ? 'Sí' : 'No'}</p>
                <p>Vegetariano: {nutritionalInfo.vegetarian ? 'Sí' : 'No'}</p>
                <p>Pescetariano: {nutritionalInfo.pescetarian ? 'Sí' : 'No'}</p>
                <p>Contiene Carne: {nutritionalInfo.contains_meat ? 'Sí' : 'No'}</p>
                <p>Contiene Vegetales: {nutritionalInfo.contains_vegetables ? 'Sí' : 'No'}</p>
                <p>Contiene Pescado/Mariscos/Enlatados/Conservas: {nutritionalInfo.contains_fish_shellfish_canned_preserved ? 'Sí' : 'No'}</p>
                <p>Cereal: {nutritionalInfo.cereal ? 'Sí' : 'No'}</p>
                <p>Pasta o Arroz: {nutritionalInfo.pasta_or_rice ? 'Sí' : 'No'}</p>
                <p>Lácteos/Yogur/Queso: {nutritionalInfo.dairy_yogurt_cheese ? 'Sí' : 'No'}</p>
                <p>Fruta: {nutritionalInfo.fruit ? 'Sí' : 'No'}</p>
                <p>Nueces: {nutritionalInfo.nuts ? 'Sí' : 'No'}</p>
                <p>Legumbre: {nutritionalInfo.legume ? 'Sí' : 'No'}</p>
                <p>Salsa o Condimento: {nutritionalInfo.sauce_or_condiment ? 'Sí' : 'No'}</p>
                <p>Embutido: {nutritionalInfo.deli_meat ? 'Sí' : 'No'}</p>
                <p>Pan o Tostada: {nutritionalInfo.bread_or_toast ? 'Sí' : 'No'}</p>
                <p>Huevo: {nutritionalInfo.egg ? 'Sí' : 'No'}</p>
                <p>Bebida Especial o Suplemento: {nutritionalInfo.special_drink_or_supplement ? 'Sí' : 'No'}</p>
                <p>Tubérculo: {nutritionalInfo.tuber ? 'Sí' : 'No'}</p>
                <p>Otro: {nutritionalInfo.other ? 'Sí' : 'No'}</p>
            </div>
        )}
    </div>
);
}

export default CreateIngredient;
