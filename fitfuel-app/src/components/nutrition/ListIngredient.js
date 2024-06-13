import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ListIngredient.css';

function ListIngredients() {
    const [ingredients, setIngredients] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
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
            setTotalPages(Math.ceil(data.length / itemsPerPage));
        })
        .catch(error => console.error('Error fetching ingredients:', error));
    }, [apiUrl, itemsPerPage]);

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
            setTotalPages(Math.ceil(updatedIngredients.length / itemsPerPage));
        };

        applyFilters();
    }, [filters, ingredients, itemsPerPage]);

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

    const currentIngredients = filteredIngredients.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className="container-listingredient">
            <h1 className="mb-4">Lista de Ingredientes</h1>
            <div className="row-listingredient mb-4">
                <div className="col-md-2-listingredient mb-3">
                    <input
                        type="text"
                        className="form-control-listingredient mb-2"
                        placeholder="Filtrar por nombre..."
                        value={filters.name}
                        onChange={(e) => handleFilterChange({ target: { name: 'name', value: e.target.value } })}
                    />
                    <input
                        type="number"
                        className="form-control-listingredient mb-2"
                        placeholder="Calorías mínimas"
                        value={filters.minCalories}
                        onChange={(e) => handleFilterChange({ target: { name: 'minCalories', value: e.target.value } })}
                    />
                    <input
                        type="number"
                        className="form-control-listingredient"
                        placeholder="Calorías máximas"
                        value={filters.maxCalories}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxCalories', value: e.target.value } })}
                    />
                </div>
                <div className="col-md-2-listingredient mb-3">
                    <input
                        type="number"
                        className="form-control-listingredient mb-2"
                        placeholder="Proteínas mínimas"
                        value={filters.minProtein}
                        onChange={(e) => handleFilterChange({ target: { name: 'minProtein', value: e.target.value } })}
                    />
                    <input
                        type="number"
                        className="form-control-listingredient mb-2"
                        placeholder="Proteínas máximas"
                        value={filters.maxProtein}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxProtein', value: e.target.value } })}
                    />
                </div>
                <div className="col-md-2-listingredient mb-3">
                    <input
                        type="number"
                        className="form-control-listingredient mb-2"
                        placeholder="Carbohidratos mínimos"
                        value={filters.minCarbohydrates}
                        onChange={(e) => handleFilterChange({ target: { name: 'minCarbohydrates', value: e.target.value } })}
                    />
                    <input
                        type="number"
                        className="form-control-listingredient mb-2"
                        placeholder="Carbohidratos máximos"
                        value={filters.maxCarbohydrates}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxCarbohydrates', value: e.target.value } })}
                    />
                </div>
                <div className="col-md-2-listingredient mb-3">
                    <input
                        type="number"
                        className="form-control-listingredient mb-2"
                        placeholder="Grasas mínimas"
                        value={filters.minFat}
                        onChange={(e) => handleFilterChange({ target: { name: 'minFat', value: e.target.value } })}
                    />
                    <input
                        type="number"
                        className="form-control-listingredient mb-2"
                        placeholder="Grasas máximas"
                        value={filters.maxFat}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxFat', value: e.target.value } })}
                    />
                </div>
                <div className="col-md-2-listingredient mb-3">
                    <input
                        type="number"
                        className="form-control-listingredient mb-2"
                        placeholder="Azúcar mínimo"
                        value={filters.minSugar}
                        onChange={(e) => handleFilterChange({ target: { name: 'minSugar', value: e.target.value } })}
                    />
                    <input
                        type="number"
                        className="form-control-listingredient"
                        placeholder="Azúcar máximo"
                        value={filters.maxSugar}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxSugar', value: e.target.value } })}
                    />
                </div>
                <div className="col-md-2-listingredient mb-3">
                    <input
                        type="number"
                        className="form-control-listingredient mb-2"
                        placeholder="Fibra mínima"
                        value={filters.minFiber}
                        onChange={(e) => handleFilterChange({ target: { name: 'minFiber', value: e.target.value } })}
                    />
                    <input
                        type="number"
                        className="form-control-listingredient"
                        placeholder="Fibra máxima"
                        value={filters.maxFiber}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxFiber', value: e.target.value } })}
                    />
                </div>
                <button className="btn btn-secondary-listingredient mt-3" onClick={resetFilters}>Limpiar Filtros</button>
            </div>

            <table className="table-listingredient table-striped">
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
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {currentIngredients.map(ingredient => (
                        <tr key={ingredient.id} onClick={() => navigate(`/nutrition/ingredients/${ingredient.id}`)} style={{ cursor: 'pointer' }}>
                            <td>{ingredient.name}</td>
                            <td>{ingredient.calories.toFixed(2)}</td>
                            <td>{ingredient.protein.toFixed(2)}</td>
                            <td>{ingredient.carbohydrates.toFixed(2)}</td>
                            <td>{ingredient.fat.toFixed(2)}</td>
                            <td>{ingredient.sugar.toFixed(2)}</td>
                            <td>{ingredient.fiber.toFixed(2)}</td>
                            <td>{ingredient.saturated_fat.toFixed(2)}</td>
                            <td>
                                <Link to={`/nutrition/edit-ingredient/${ingredient.id}`} className="btn btn-primary-listingredient me-2" onClick={(e) => e.stopPropagation()}>Editar</Link>
                            </td>
                            <td>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteIngredient(ingredient.id); }} className="btn btn-danger-listingredient">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {filteredIngredients.length === 0 && (
                <div className="alert alert-info-listingredient" role="alert">
                    No se encontraron ingredientes que coincidan con los filtros seleccionados.
                </div>
            )}

            <div className="pagination-listingredient">
                <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="btn btn-secondary-listingredient"
                >
                    Anterior
                </button>
                <span> Página {currentPage + 1} de {totalPages} </span>
                <button
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="btn btn-secondary-listingredient"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export default ListIngredients;
