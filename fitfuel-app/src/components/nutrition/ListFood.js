import React, { useState } from 'react';

function ListFood() {
    const [foods, setFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        calories: '',
        protein: '',
        carbohydrates: '',
        fat: '',
        sugar: '',
        fiber: '',
        saturated_fat: '',
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
    });

    // ...

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        const filterValue = type === 'checkbox' ? checked : value;
        setFilters(prevFilters => ({ ...prevFilters, [name]: filterValue }));
        filterFoods(name, filterValue);
    };

    const resetFilters = () => {
        setFilters({
            name: '',
            calories: '',
            protein: '',
            carbohydrates: '',
            fat: '',
            sugar: '',
            fiber: '',
            saturated_fat: '',
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
        });
        setFilteredFoods(foods);
    };

    const filterFoods = (name, value) => {
        let updatedFoods = foods;

        if (name === 'name' && value) {
            updatedFoods = updatedFoods.filter(food => food.name.toLowerCase().includes(value.toLowerCase()));
        }

        if (name === 'calories' && value) {
            updatedFoods = updatedFoods.filter(food => food.calories <= value);
        }

        if (name === 'protein' && value) {
            updatedFoods = updatedFoods.filter(food => food.protein <= value);
        }

        if (name === 'carbohydrates' && value) {
            updatedFoods = updatedFoods.filter(food => food.carbohydrates <= value);
        }

        if (name === 'fat' && value) {
            updatedFoods = updatedFoods.filter(food => food.fat <= value);
        }

        if (name === 'sugar' && value) {
            updatedFoods = updatedFoods.filter(food => food.sugar <= value);
        }

        if (name === 'fiber' && value) {
            updatedFoods = updatedFoods.filter(food => food.fiber <= value);
        }

        if (name === 'saturated_fat' && value) {
            updatedFoods = updatedFoods.filter(food => food.saturated_fat <= value);
        }

        if (name === 'gluten_free') {
            updatedFoods = updatedFoods.filter(food => food.gluten_free === value);
        }

        if (name === 'lactose_free') {
            updatedFoods = updatedFoods.filter(food => food.lactose_free === value);
        }

        if (name === 'vegan') {
            updatedFoods = updatedFoods.filter(food => food.vegan === value);
        }

        if (name === 'vegetarian') {
            updatedFoods = updatedFoods.filter(food => food.vegetarian === value);
        }

        if (name === 'pescetarian') {
            updatedFoods = updatedFoods.filter(food => food.pescetarian === value);
        }

        if (name === 'contains_meat') {
            updatedFoods = updatedFoods.filter(food => food.contains_meat === value);
        }

        if (name === 'contains_vegetables') {
            updatedFoods = updatedFoods.filter(food => food.contains_vegetables === value);
        }

        if (name === 'contains_fish_shellfish_canned_preserved') {
            updatedFoods = updatedFoods.filter(food => food.contains_fish_shellfish_canned_preserved === value);
        }

        if (name === 'cereal') {
            updatedFoods = updatedFoods.filter(food => food.cereal === value);
        }

        if (name === 'pasta_or_rice') {
            updatedFoods = updatedFoods.filter(food => food.pasta_or_rice === value);
        }

        if (name === 'dairy_yogurt_cheese') {
            updatedFoods = updatedFoods.filter(food => food.dairy_yogurt_cheese === value);
        }

        if (name === 'fruit') {
            updatedFoods = updatedFoods.filter(food => food.fruit === value);
        }

        if (name === 'nuts') {
            updatedFoods = updatedFoods.filter(food => food.nuts === value);
        }

        if (name === 'legume') {
            updatedFoods = updatedFoods.filter(food => food.legume === value);
        }

        if (name === 'sauce_or_condiment') {
            updatedFoods = updatedFoods.filter(food => food.sauce_or_condiment === value);
        }

        if (name === 'deli_meat') {
            updatedFoods = updatedFoods.filter(food => food.deli_meat === value);
        }

        if (name === 'bread_or_toast') {
            updatedFoods = updatedFoods.filter(food => food.bread_or_toast === value);
        }

        if (name === 'egg') {
            updatedFoods = updatedFoods.filter(food => food.egg === value);
        }

        if (name === 'special_drink_or_supplement') {
            updatedFoods = updatedFoods.filter(food => food.special_drink_or_supplement === value);
        }

        if (name === 'tuber') {
            updatedFoods = updatedFoods.filter(food => food.tuber === value);
        }

        if (name === 'other') {
            updatedFoods = updatedFoods.filter(food => food.other === value);
        }

        setFilteredFoods(updatedFoods);
    };

    return (
        <div className="container">
            <h1>Lista de Alimentos</h1>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre del Alimento</label>
                <input type="text" className="form-control" id="name" name="name" value={filters.name} onChange={handleFilterChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="calories" className="form-label">Calorías</label>
                <input type="number" className="form-control" id="calories" name="calories" value={filters.calories} onChange={handleFilterChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="protein" className="form-label">Proteínas</label>
                <input type="number" className="form-control" id="protein" name="protein" value={filters.protein} onChange={handleFilterChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="carbohydrates" className="form-label">Carbohidratos</label>
                <input type="number" className="form-control" id="carbohydrates" name="carbohydrates" value={filters.carbohydrates} onChange={handleFilterChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="fat" className="form-label">Grasas</label>
                <input type="number" className="form-control" id="fat" name="fat" value={filters.fat} onChange={handleFilterChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="sugar" className="form-label">Azúcar</label>
                <input type="number" className="form-control" id="sugar" name="sugar" value={filters.sugar} onChange={handleFilterChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="fiber" className="form-label">Fibra</label>
                <input type="number" className="form-control" id="fiber" name="fiber" value={filters.fiber} onChange={handleFilterChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="saturated_fat" className="form-label">Grasas Saturadas</label>
                <input type="number" className="form-control" id="saturated_fat" name="saturated_fat" value={filters.saturated_fat} onChange={handleFilterChange} />
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="gluten_free" name="gluten_free" checked={filters.gluten_free} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="gluten_free">Libre de Gluten</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="lactose_free" name="lactose_free" checked={filters.lactose_free} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="lactose_free">Libre de Lactosa</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="vegan" name="vegan" checked={filters.vegan} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="vegan">Vegano</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="vegetarian" name="vegetarian" checked={filters.vegetarian} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="vegetarian">Vegetariano</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="pescetarian" name="pescetarian" checked={filters.pescetarian} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="pescetarian">Pescetariano</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="contains_meat" name="contains_meat" checked={filters.contains_meat} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="contains_meat">Contiene Carne</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="contains_vegetables" name="contains_vegetables" checked={filters.contains_vegetables} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="contains_vegetables">Contiene Vegetales</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="contains_fish_shellfish_canned_preserved" name="contains_fish_shellfish_canned_preserved" checked={filters.contains_fish_shellfish_canned_preserved} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="contains_fish_shellfish_canned_preserved">Contiene Pescado/Mariscos/Enlatados/Conservas</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="cereal" name="cereal" checked={filters.cereal} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="cereal">Cereal</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="pasta_or_rice" name="pasta_or_rice" checked={filters.pasta_or_rice} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="pasta_or_rice">Pasta o Arroz</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="dairy_yogurt_cheese" name="dairy_yogurt_cheese" checked={filters.dairy_yogurt_cheese} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="dairy_yogurt_cheese">Lácteos/Yogur/Queso</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="fruit" name="fruit" checked={filters.fruit} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="fruit">Fruta</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="nuts" name="nuts" checked={filters.nuts} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="nuts">Nueces</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="legume" name="legume" checked={filters.legume} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="legume">Legumbre</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="sauce_or_condiment" name="sauce_or_condiment" checked={filters.sauce_or_condiment} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="sauce_or_condiment">Salsa o Condimento</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="deli_meat" name="deli_meat" checked={filters.deli_meat} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="deli_meat">Embutido</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="bread_or_toast" name="bread_or_toast" checked={filters.bread_or_toast} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="bread_or_toast">Pan o Tostada</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="egg" name="egg" checked={filters.egg} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="egg">Huevo</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="special_drink_or_supplement" name="special_drink_or_supplement" checked={filters.special_drink_or_supplement} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="special_drink_or_supplement">Bebida Especial o Suplemento</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="tuber" name="tuber" checked={filters.tuber} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="tuber">Tubérculo</label>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="other" name="other" checked={filters.other} onChange={handleFilterChange} />
                <label className="form-check-label" htmlFor="other">Otro</label>
            </div>
            <div className="mb-3">
                <button className="btn btn-primary" onClick={resetFilters}>Limpiar Filtros</button>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Calorías</th>
                        <th>Proteínas</th>
                        <th>Carbohidratos</th>
                        <th>Grasas</th>
                        <th>Azúcar</th>
                        <th>Fibra</th>
                        <th>Grasas Saturadas</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFoods.map(food => (
                        <tr key={food.id}>
                            <td>{food.name}</td>
                            <td>{food.calories}</td>
                            <td>{food.protein}</td>
                            <td>{food.carbohydrates}</td>
                            <td>{food.fat}</td>
                            <td>{food.sugar}</td>
                            <td>{food.fiber}</td>
                            <td>{food.saturated_fat}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListFood;