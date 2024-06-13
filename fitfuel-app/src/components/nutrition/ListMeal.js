import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ListMeal.css';

function ListMeal() {
    const [meals, setMeals] = useState([]);
    const [filteredMeals, setFilteredMeals] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10); // Ajusta este número según sea necesario
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

    useEffect(() => {
        const applyFilters = () => {
            let updatedMeals = meals.filter(meal => {
                return Object.entries(filters).every(([key, value]) => {
                    if (value === '' || value === false) return true; // Ignore filter if empty or false
                    if (typeof value === 'boolean') {
                        return meal[key] === value;
                    } else if (key.includes('min') || key.includes('max')) {
                        const field = key.replace('min', '').replace('max', '').toLowerCase();
                        if (key.startsWith('min')) {
                            return parseFloat(meal[field]) >= parseFloat(value);
                        } else {
                            return parseFloat(meal[field]) <= parseFloat(value);
                        }
                    } else {
                        return meal[key].toLowerCase().includes(value.toLowerCase());
                    }
                });
            });
            setFilteredMeals(updatedMeals);
            setTotalPages(Math.ceil(updatedMeals.length / itemsPerPage));
        };

        applyFilters();
    }, [filters, meals, itemsPerPage]);

    const handleDeleteMeal = (mealId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta comida?')) {
            fetch(`${apiUrl}/nutrition/meals/${mealId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
            })
            .then(response => {
                if (response.ok) {
                    setMeals(meals.filter(meal => meal.id !== mealId));
                } else {
                    console.error('Error al eliminar la comida');
                }
            })
            .catch(error => console.error('Error al eliminar la comida:', error));
        }
    };

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

    useEffect(() => {
        fetch(`${apiUrl}/nutrition/meals/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            setMeals(data);
            setFilteredMeals(data); // Inicializar las comidas filtradas con todas las comidas
            setTotalPages(Math.ceil(data.length / itemsPerPage));
        })
        .catch(error => console.error('Error fetching meals:', error));
    }, [apiUrl, itemsPerPage]);

    const currentMeals = filteredMeals.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className="container-listmeal">
            <h1 className="mb-4">Lista de Comidas</h1>
            <div className="row-listmeal mb-4">
                <div className="col-md-2-listmeal mb-3">
                    <input
                        type="text"
                        className="form-control-listmeal mb-2"
                        placeholder="Filtrar por nombre..."
                        value={filters.name}
                        onChange={handleFilterChange}
                        name="name"
                    />
                    <input
                        type="number"
                        className="form-control-listmeal mb-2"
                        placeholder="Calorías mínimas"
                        value={filters.minCalories}
                        onChange={handleFilterChange}
                        name="minCalories"
                    />
                    <input
                        type="number"
                        className="form-control-listmeal"
                        placeholder="Calorías máximas"
                        value={filters.maxCalories}
                        onChange={handleFilterChange}
                        name="maxCalories"
                    />
                </div>
                <div className="col-md-2-listmeal mb-3">
                    <input
                        type="number"
                        className="form-control-listmeal mb-2"
                        placeholder="Proteínas mínimas"
                        value={filters.minProtein}
                        onChange={handleFilterChange}
                        name="minProtein"
                    />
                    <input
                        type="number"
                        className="form-control-listmeal mb-2"
                        placeholder="Proteínas máximas"
                        value={filters.maxProtein}
                        onChange={handleFilterChange}
                        name="maxProtein"
                    />
                </div>
                <div className="col-md-2-listmeal mb-3">
                    <input
                        type="number"
                        className="form-control-listmeal mb-2"
                        placeholder="Carbohidratos mínimos"
                        value={filters.minCarbohydrates}
                        onChange={handleFilterChange}
                        name="minCarbohydrates"
                    />
                    <input
                        type="number"
                        className="form-control-listmeal mb-2"
                        placeholder="Carbohidratos máximos"
                        value={filters.maxCarbohydrates}
                        onChange={handleFilterChange}
                        name="maxCarbohydrates"
                    />
                </div>
                <div className="col-md-2-listmeal mb-3">
                    <input
                        type="number"
                        className="form-control-listmeal mb-2"
                        placeholder="Grasas mínimas"
                        value={filters.minFat}
                        onChange={handleFilterChange}
                        name="minFat"
                    />
                    <input
                        type="number"
                        className="form-control-listmeal mb-2"
                        placeholder="Grasas máximas"
                        value={filters.maxFat}
                        onChange={handleFilterChange}
                        name="maxFat"
                    />
                </div>
                <div className="col-md-2-listmeal mb-3">
                    <input
                        type="number"
                        className="form-control-listmeal mb-2"
                        placeholder="Azúcar mínimo"
                        value={filters.minSugar}
                        onChange={handleFilterChange}
                        name="minSugar"
                    />
                    <input
                        type="number"
                        className="form-control-listmeal"
                        placeholder="Azúcar máximo"
                        value={filters.maxSugar}
                        onChange={handleFilterChange}
                        name="maxSugar"
                    />
                </div>
                <div className="col-md-2-listmeal mb-3">
                    <input
                        type="number"
                        className="form-control-listmeal mb-2"
                        placeholder="Fibra mínima"
                        value={filters.minFiber}
                        onChange={handleFilterChange}
                        name="minFiber"
                    />
                    <input
                        type="number"
                        className="form-control-listmeal"
                        placeholder="Fibra máxima"
                        value={filters.maxFiber}
                        onChange={handleFilterChange}
                        name="maxFiber"
                    />
                </div>
                <button className="btn-listmeal btn-secondary-listmeal mt-3" onClick={resetFilters}>Limpiar Filtros</button>
            </div>

            <table className="table-listmeal table-striped-listmeal">
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
                    {currentMeals.map(meal => (
                        <tr key={meal.id} onClick={() => navigate(`/nutrition/meals/${meal.id}`)} style={{ cursor: 'pointer' }}>
                            <td>{meal.name}</td>
                            <td>{(meal.calories || 0).toFixed(2)}</td>
                            <td>{(meal.protein || 0).toFixed(2)}</td>
                            <td>{(meal.carbohydrates || 0).toFixed(2)}</td>
                            <td>{(meal.fat || 0).toFixed(2)}</td>
                            <td>{(meal.sugar || 0).toFixed(2)}</td>
                            <td>{(meal.fiber || 0).toFixed(2)}</td>
                            <td>{(meal.saturated_fat || 0).toFixed(2)}</td>
                            <td>
                                <Link to={`/nutrition/edit-meal/${meal.id}`} className="btn-listmeal btn-primary-listmeal me-2" onClick={(e) => e.stopPropagation()}>Editar</Link>
                            </td>
                            <td>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteMeal(meal.id); }} className="btn-listmeal btn-danger-listmeal">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredMeals.length === 0 && (
                <div className="alert-listmeal alert-info-listmeal" role="alert">
                    No se encontraron comidas que coincidan con los filtros seleccionados.
                </div>
            )}

            <div className="pagination-listmeal">
                <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="btn-listmeal btn-secondary-listmeal"
                >
                    Anterior
                </button>
                <span> Página {currentPage + 1} de {totalPages} </span>
                <button
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="btn-listmeal btn-secondary-listmeal"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export default ListMeal;
