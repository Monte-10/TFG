import React, { useState, useEffect } from 'react';

function CreateMeal() {
  const [dishes, setDishes] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([{
    dishId: '',
    portion: '',
    notes: ''
  }]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [name, setName] = useState('');
  const [mealCreated, setMealCreated] = useState(false);
  const [createdMealId, setCreatedMealId] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/nutrition/dishes/')
      .then(response => response.json())
      .then(data => {
        setDishes(data);
      });

    fetch('http://127.0.0.1:8000/user/regularusers/')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        if (data.length > 0) {
          setSelectedUser(data[0].id.toString()); // Inicializa con el primer usuario, si existe
        }
      });
  }, []);

  const calculateNutritionTotals = () => {
    let totals = {
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

    selectedDishes.forEach(({ dishId, portion }) => {
        const foundDish = dishes.find(dish => dish.id.toString() === dishId);
        if (foundDish && portion) {
            totals.calories += foundDish.calories * portion;
            totals.protein += foundDish.protein * portion;
            totals.carbohydrates += foundDish.carbohydrates * portion;
            totals.fat += foundDish.fat * portion;
            totals.sugar += foundDish.sugar * portion;
            totals.fiber += foundDish.fiber * portion;
            totals.saturated_fat += foundDish.saturated_fat * portion;
            totals.gluten_free = totals.gluten_free && foundDish.glutenFree;
            totals.lactose_free = totals.lactose_free && foundDish.lactoseFree;
            totals.vegan = totals.vegan && foundDish.vegan;
            totals.vegetarian = totals.vegetarian && foundDish.vegetarian;
            totals.pescetarian = totals.pescetarian && foundDish.pescetarian;
            totals.contains_meat = totals.contains_meat || foundDish.containsMeat;
            totals.contains_vegetables = totals.contains_vegetables || foundDish.containsVegetables;
            totals.contains_fish_shellfish_canned_preserved = totals.contains_fish_shellfish_canned_preserved || foundDish.containsFishShellfishCannedPreserved;
            totals.cereal = totals.cereal || foundDish.cereal;
            totals.pasta_or_rice = totals.pasta_or_rice || foundDish.pastaOrRice;
            totals.dairy_yogurt_cheese = totals.dairy_yogurt_cheese || foundDish.dairyYogurtCheese;
            totals.fruit = totals.fruit || foundDish.fruit;
            totals.nuts = totals.nuts || foundDish.nuts;
            totals.legume = totals.legume || foundDish.legume;
            totals.sauce_or_condiment = totals.sauce_or_condiment || foundDish.sauceOrCondiment;
            totals.deli_meat = totals.deli_meat || foundDish.deliMeat;
            totals.bread_or_toast = totals.bread_or_toast || foundDish.breadOrToast;
            totals.egg = totals.egg || foundDish.egg;
            totals.special_drink_or_supplement = totals.special_drink_or_supplement || foundDish.specialDrinkOrSupplement;
            totals.tuber = totals.tuber || foundDish.tuber;
            totals.other = totals.other || foundDish.other;
        }
    });

    return totals;
};


const nutritionTotals = calculateNutritionTotals();

  const handleDishChange = (index, field, value) => {
    const newSelectedDishes = [...selectedDishes];
    newSelectedDishes[index][field] = value;
    setSelectedDishes(newSelectedDishes);
  };

  const addDishField = () => {
    setSelectedDishes([...selectedDishes, { dishId: '', portion: '', notes: '' }]);
  };

  const removeDishField = (index) => {
    const newSelectedDishes = [...selectedDishes];
    newSelectedDishes.splice(index, 1);
    setSelectedDishes(newSelectedDishes);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const mealData = {
      name,
      user: selectedUser,
      dishes_data: selectedDishes.map(sd => ({
        dish: sd.dishId,
        portion: sd.portion,
        notes: sd.notes
      }))
    };

    console.log("Sending meal data", mealData);

    fetch('http://127.0.0.1:8000/nutrition/meals/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mealData),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      console.log('Success:', data);
      setMealCreated(true);
      setCreatedMealId(data.id); // Asume que la respuesta de la API incluye el ID de la comida creada
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="container mt-5">
        <h2>Crear Comida</h2>
        {mealCreated ? (
            <div className="alert alert-success">
                <p>La Comida se ha creado correctamente.</p>
                <a href={`/meals/${createdMealId}`} className="btn btn-primary">Ver Comida</a>
                <button onClick={() => setMealCreated(false)} className="btn btn-secondary ml-2">Crear otra Comida</button>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre de la Comida:</label>
                    <input type="text" className="form-control" id="name" value={name} onChange={e => setName(e.target.value)} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="userSelect" className="form-label">Usuario:</label>
                    <select className="form-select" id="userSelect" value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
                        <option value="">Seleccione un usuario</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </div>

                {selectedDishes.map((dish, index) => (
                    <div key={index} className="mb-3">
                        <div className="input-group">
                            <select className="form-select" value={dish.dishId} onChange={e => handleDishChange(index, 'dishId', e.target.value)} required>
                                <option value="">Seleccione un Plato</option>
                                {dishes.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                            <input type="number" className="form-control" placeholder="Porción" value={dish.portion} onChange={e => handleDishChange(index, 'portion', e.target.value)} />
                            <input type="text" className="form-control" placeholder="Notas (opcional)" value={dish.notes} onChange={e => handleDishChange(index, 'notes', e.target.value)} />
                            <button type="button" className="btn btn-danger" onClick={() => removeDishField(index)}>Eliminar</button>
                        </div>
                    </div>
                ))}

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button type="button" className="btn btn-outline-secondary me-md-2" onClick={addDishField}>Añadir Plato</button>
                    <button type="submit" className="btn btn-primary">Crear Comida</button>
                </div>
            </form>
        )}

        {/* Totales Nutricionales */}
        <div className="card mt-3">
            <div className="card-body">
                <h5 className="card-title">Totales Nutricionales</h5>
                <p className="card-text">Calorías: {nutritionTotals.calories}</p>
                <p className="card-text">Proteína: {nutritionTotals.protein}</p>
                <p className="card-text">Carbohidratos: {nutritionTotals.carbohydrates}</p>
                <p className="card-text">Grasas: {nutritionTotals.fat}</p>
                <p className="card-text">Azúcar: {nutritionTotals.sugar}</p>
                <p className="card-text">Fibra: {nutritionTotals.fiber}</p>
                <p className="card-text">Grasas Saturadas: {nutritionTotals.saturated_fat}</p>
                <p className="card-text">Libre de Gluten: {nutritionTotals.gluten_free ? 'Sí' : 'No'}</p>
                <p className="card-text">Libre de Lactosa: {nutritionTotals.lactose_free ? 'Sí' : 'No'}</p>
                <p className="card-text">Vegano: {nutritionTotals.vegan ? 'Sí' : 'No'}</p>
                <p className="card-text">Vegetariano: {nutritionTotals.vegetarian ? 'Sí' : 'No'}</p>
                <p className="card-text">Pescetariano: {nutritionTotals.pescetarian ? 'Sí' : 'No'}</p>
                <p className="card-text">Contiene Carne: {nutritionTotals.contains_meat ? 'Sí' : 'No'}</p>
                <p className="card-text">Contiene Vegetales: {nutritionTotals.contains_vegetables ? 'Sí' : 'No'}</p>
                <p className="card-text">Contiene Pescado/Mariscos/Enlatados/Conservas: {nutritionTotals.contains_fish_shellfish_canned_preserved ? 'Sí' : 'No'}</p>
                <p className="card-text">Cereal: {nutritionTotals.cereal ? 'Sí' : 'No'}</p>
                <p className="card-text">Pasta o Arroz: {nutritionTotals.pasta_or_rice ? 'Sí' : 'No'}</p>
                <p className="card-text">Lácteos (Yogur, Queso): {nutritionTotals.dairy_yogurt_cheese ? 'Sí' : 'No'}</p>
                <p className="card-text">Fruta: {nutritionTotals.fruit ? 'Sí' : 'No'}</p>
                <p className="card-text">Nueces: {nutritionTotals.nuts ? 'Sí' : 'No'}</p>
                <p className="card-text">Legumbres: {nutritionTotals.legume ? 'Sí' : 'No'}</p>
                <p className="card-text">Salsas o Condimentos: {nutritionTotals.sauce_or_condiment ? 'Sí' : 'No'}</p>
                <p className="card-text">Embutidos: {nutritionTotals.deli_meat ? 'Sí' : 'No'}</p>
                <p className="card-text">Pan o Tostadas: {nutritionTotals.bread_or_toast ? 'Sí' : 'No'}</p>
                <p className="card-text">Huevo: {nutritionTotals.egg ? 'Sí' : 'No'}</p>
                <p className="card-text">Bebida Especial o Suplemento: {nutritionTotals.special_drink_or_supplement ? 'Sí' : 'No'}</p>
                <p className="card-text">Tubérculo: {nutritionTotals.tuber ? 'Sí' : 'No'}</p>
                <p className="card-text">Otro: {nutritionTotals.other ? 'Sí' : 'No'}</p>
            </div>
        </div>
    </div>
  );
}

export default CreateMeal;
