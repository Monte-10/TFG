import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function ListIngredients() {
    const [ingredients, setIngredients] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [filters, setFilters] = useState({
        name: '',
        minCalories: '',
        maxCalories: '',
        minProtein: '',
        maxProtein: '',
        minCarbohydrates: '',
        maxCarbohydrates: '',
        minFat: '',
        maxFat: '',
        minSugar: '',
        maxSugar: '',
        minFiber: '',
        maxFiber: '',
        minSaturatedFat: '',
        maxSaturatedFat: '',
        glutenFree: false,
        lactoseFree: false,
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
        other: false
    });

    const navigate = useNavigate();

    const handleDeleteIngredient = (ingredientId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este ingrediente?')) {
            fetch(`${apiUrl}/nutrition/ingredients/${ingredientId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
            })
            .then(response => {
                if (response.ok) {
                    setIngredients(ingredients.filter(ingredient => ingredient.id !== ingredientId));
                } else {
                    console.error('Error al eliminar el ingrediente');
                }
            })
            .catch(error => console.error('Error al eliminar el ingrediente:', error));
        }
    };

    useEffect(() => {
        fetch(`${apiUrl}/nutrition/ingredients/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            setIngredients(data);
            setFilteredIngredients(data);
        })
        .catch(error => console.error('Error fetching ingredients:', error));
    }, []);

    useEffect(() => {
        const applyFilters = () => {
            let updatedIngredients = ingredients.filter(ingredient => {
                return Object.entries(filters).every(([key, value]) => {
                    if (value === '' || value === false) return true; // Ignore filter if empty or false
                    if (typeof value === 'boolean') {
                        return ingredient[key] === value;
                    } else if (key.includes('min') || key.includes('max')) {
                        const field = key.replace('min', '').replace('max', '').toLowerCase();
                        if (key.startsWith('min')) {
                            return parseFloat(ingredient[field]) >= parseFloat(value);
                        } else {
                            return parseFloat(ingredient[field]) <= parseFloat(value);
                        }
                    } else {
                        return ingredient[key].toLowerCase().includes(value.toLowerCase());
                    }
                });
            });
            setFilteredIngredients(updatedIngredients);
        };

        applyFilters();
    }, [filters, ingredients]);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const resetFilters = () => {
        setFilters({
            name: '',
            minCalories: '',
            maxCalories: '',
            minProtein: '',
            maxProtein: '',
            minCarbohydrates: '',
            maxCarbohydrates: '',
            minFat: '',
            maxFat: '',
            minSugar: '',
            maxSugar: '',
            minFiber: '',
            maxFiber: '',
            minSaturatedFat: '',
            maxSaturatedFat: '',
            glutenFree: false,
            lactoseFree: false,
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
            other: false
        });
    };

    return (
        <div className="container">
            <h1>Lista de Ingredientes</h1>
            <div className="row">
                <div className="col-md-2 mb-3">
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Filtrar por nombre..."
                        value={filters.name}
                        onChange={(e) => handleFilterChange({ target: { name: 'name', value: e.target.value } })}
                    />
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Calorías mínimas"
                        value={filters.minCalories}
                        onChange={(e) => handleFilterChange({ target: { name: 'minCalories', value: e.target.value } })}
                    />
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Calorías máximas"
                        value={filters.maxCalories}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxCalories', value: e.target.value } })}
                    />
                </div>
                <div className="col-md-2 mb-3">
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Proteínas mínimas"
                        value={filters.minProtein}
                        onChange={(e) => handleFilterChange({ target: { name: 'minProtein', value: e.target.value } })}
                    />
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Proteínas máximas"
                        value={filters.maxProtein}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxProtein', value: e.target.value } })}
                    />
                </div>
                <div className="col-md-2 mb-3">
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Carbohidratos mínimos"
                        value={filters.minCarbohydrates}
                        onChange={(e) => handleFilterChange({ target: { name: 'minCarbohydrates', value: e.target.value } })}
                    />
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Carbohidratos máximos"
                        value={filters.maxCarbohydrates}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxCarbohydrates', value: e.target.value } })}
                    />
                </div>
                <div className="col-md-2 mb-3">
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Grasas mínimas"
                        value={filters.minFat}
                        onChange={(e) => handleFilterChange({ target: { name: 'minFat', value: e.target.value } })}
                    />
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Grasas máximas"
                        value={filters.maxFat}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxFat', value: e.target.value } })}
                    />
                </div>
                <div className="col-md-2 mb-3">
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Azúcar mínimo"
                        value={filters.minSugar}
                        onChange={(e) => handleFilterChange({ target: { name: 'minSugar', value: e.target.value } })}
                    />
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Azúcar máximo"
                        value={filters.maxSugar}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxSugar', value: e.target.value } })}
                    />
                </div>
                <div className="col-md-2 mb-3">
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Fibra mínima"
                        value={filters.minFiber}
                        onChange={(e) => handleFilterChange({ target: { name: 'minFiber', value: e.target.value } })}
                    />
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Fibra máxima"
                        value={filters.maxFiber}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxFiber', value: e.target.value } })}
                    />
                </div>
                <button className="btn btn-secondary mt-3" onClick={resetFilters}>Limpiar Filtros</button>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Calorías</th>
                        <th>Proteínas</th>
                        <th>Carbohidratos</th>
                        <th>Grasas</th>
                        <th>Azúcares</th>
                        <th>Fibra</th>
                        <th>Grasas Saturadas</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredIngredients.map(ingredient => (
                        <tr key={ingredient.id} onClick={() => navigate(`/nutrition/ingredients/${ingredient.id}`)} style={{cursor: 'pointer'}}>
                            <td>{ingredient.name}</td>
                            <td>{ingredient.calories}</td>
                            <td>{ingredient.protein}</td>
                            <td>{ingredient.carbohydrates}</td>
                            <td>{ingredient.fat}</td>
                            <td>{ingredient.sugar}</td>
                            <td>{ingredient.fiber}</td>
                            <td>{ingredient.saturatedFat}</td>
                            <td>
                                <Link to={`/nutrition/edit-ingredient/${ingredient.id}`} className="btn btn-primary me-2">Editar</Link>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteIngredient(ingredient.id)} className="btn btn-danger">Eliminar</button>
                            </td>
                        </tr>
                ))}
            </tbody>
        </table>

        {filteredIngredients.length === 0 && (
            <div className="alert alert-info" role="alert">
                No se encontraron ingredientes que coincidan con los filtros seleccionados.
            </div>
        )}
    </div>
);
};

export default ListIngredients;