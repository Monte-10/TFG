import React, { useState } from 'react';

function CreateFood() {
    const initialState = {
        name: '',
        unit_weight: 0,
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

    const [foodData, setFoodData] = useState(initialState);
    const [creationSuccess, setCreationSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFoodData({
            ...foodData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        console.log('Submitting food data:', foodData);

        fetch('http://127.0.0.1:8000/nutrition/foods/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(foodData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Food created successfully:', data);
            setCreationSuccess(true);
            setFoodData(initialState);
        })
        .catch((error) => {
            console.error('Error creating food:', error);
            setError(error.message);
        });
    };

    if (creationSuccess) {
        return (
            <div>
                <p>La Comida se ha creado correctamente.</p>
                <a href="/nutrition/foods">Volver a lista de Comidas</a><br />
                <button onClick={() => setCreationSuccess(false)}>Crear una nueva</button>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2>Create Food</h2>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {creationSuccess && <div className="alert alert-success" role="alert">La comida ha sido creada correctamente.</div>}

            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={foodData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="unit_weight" className="form-label">Unit Weight:</label>
                        <input
                            type="number"
                            className="form-control"
                            id="unit_weight"
                            name="unit_weight"
                            value={foodData.unit_weight}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="calories" className="form-label">Calories:</label>
                        <input
                            type="number"
                            className="form-control"
                            id="calories"
                            name="calories"
                            value={foodData.calories}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="protein" className="form-label">Protein:</label>
                        <input
                            type="number"
                            className="form-control"
                            id="protein"
                            name="protein"
                            value={foodData.protein}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="carbohydrates" className="form-label">Carbohydrates:</label>
                        <input
                            type="number"
                            className="form-control"
                            id="carbohydrates"
                            name="carbohydrates"
                            value={foodData.carbohydrates}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="sugar" className="form-label">Sugar:</label>
                        <input
                            type="number"
                            className="form-control"
                            id="sugar"
                            name="sugar"
                            value={foodData.sugar}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="fiber" className="form-label">Fiber:</label>
                        <input
                            type="number"
                            className="form-control"
                            id="fiber"
                            name="fiber"
                            value={foodData.fiber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="fat" className="form-label">Fat:</label>
                        <input
                            type="number"
                            className="form-control"
                            id="fat"
                            name="fat"
                            value={foodData.fat}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="saturated_fat" className="form-label">Saturated Fat:</label>
                        <input
                            type="number"
                            className="form-control"
                            id="saturated_fat"
                            name="saturated_fat"
                            value={foodData.saturated_fat}
                            onChange={handleChange}
                            required
                        />
                    </div>

                </div>

                <div className="col-md-6">
                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="lactose_free"
                            name="lactose_free"
                            checked={foodData.lactose_free}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="lactose_free">Lactose Free</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="vegan"
                            name="vegan"
                            checked={foodData.vegan}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="vegan">Vegan</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="vegetarian"
                            name="vegetarian"
                            checked={foodData.vegetarian}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="vegetarian">Vegetarian</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="pescetarian"
                            name="pescetarian"
                            checked={foodData.pescetarian}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="pescetarian">Pescetarian</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="contains_meat"
                            name="contains_meat"
                            checked={foodData.contains_meat}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="contains_meat">Contains Meat</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="contains_vegetables"
                            name="contains_vegetables"
                            checked={foodData.contains_vegetables}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="contains_vegetables">Contains Vegetables</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="contains_fish_shellfish_canned_preserved"
                            name="contains_fish_shellfish_canned_preserved"
                            checked={foodData.contains_fish_shellfish_canned_preserved}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="contains_fish_shellfish_canned_preserved">Contains Fish/Shellfish/Canned/Preserved</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="cereal"
                            name="cereal"
                            checked={foodData.cereal}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="cereal">Cereal</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="pasta_or_rice"
                            name="pasta_or_rice"
                            checked={foodData.pasta_or_rice}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="pasta_or_rice">Pasta or Rice</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="dairy_yogurt_cheese"
                            name="dairy_yogurt_cheese"
                            checked={foodData.dairy_yogurt_cheese}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="dairy_yogurt_cheese">Dairy/Yogurt/Cheese</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="fruit"
                            name="fruit"
                            checked={foodData.fruit}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="fruit">Fruit</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="nuts"
                            name="nuts"
                            checked={foodData.nuts}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="nuts">Nuts</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="legume"
                            name="legume"
                            checked={foodData.legume}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="legume">Legume</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="sauce_or_condiment"
                            name="sauce_or_condiment"
                            checked={foodData.sauce_or_condiment}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="sauce_or_condiment">Sauce or Condiment</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="deli_meat"
                            name="deli_meat"
                            checked={foodData.deli_meat}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="deli_meat">Deli Meat</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="bread_or_toast"
                            name="bread_or_toast"
                            checked={foodData.bread_or_toast}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="bread_or_toast">Bread or Toast</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="egg"
                            name="egg"
                            checked={foodData.egg}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="egg">Egg</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="special_drink_or_supplement"
                            name="special_drink_or_supplement"
                            checked={foodData.special_drink_or_supplement}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="special_drink_or_supplement">Special Drink or Supplement</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="tuber"
                            name="tuber"
                            checked={foodData.tuber}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="tuber">Tuber</label>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="other"
                            name="other"
                            checked={foodData.other}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="other">Other</label>
                    </div>

                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <button type="submit" className="btn btn-primary mt-3">Create Food</button>
            </form>
        </div>
    );
}
export default CreateFood;
