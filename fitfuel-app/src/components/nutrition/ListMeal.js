import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function ListMeal() {
    const [meals, setMeals] = useState([]);
    const [filteredMeals, setFilteredMeals] = useState([]);
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
        // Función para aplicar los filtros
        const applyFilters = () => {
            let updatedMeals = meals.filter(meal => {
                return Object.entries(filters).every(([key, filter]) => {
                    if (!filter.active) return true;
                    if (key === 'name') {
                        return meal.name.toLowerCase().includes(filter.value.toLowerCase());
                    } else if (['glutenFree', 'lactoseFree', 'vegan', 'vegetarian', 'pescetarian', 'contains_meat', 'contains_vegetables', 'contains_fish_shellfish_canned_preserved', 'cereal', 'pasta_or_rice', 'dairy_yogurt_cheese', 'fruit', 'nuts', 'legume', 'sauce_or_condiment', 'deli_meat', 'bread_or_toast', 'egg', 'special_drink_or_supplement', 'tuber', 'other'].includes(key)) {
                        return filter.value === '' || meal[key] === (filter.value === 'true');
                    } else if (key === 'minCalories') {
                        return parseInt(meal.calories, 10) >= parseInt(filter.value, 10);
                    } else if (key === 'maxCalories') {
                        return parseInt(meal.calories, 10) <= parseInt(filter.value, 10);
                    } else if (key === 'minProtein') {
                        return parseInt(meal.protein, 10) >= parseInt(filter.value, 10);
                    } else if (key === 'maxProtein') {
                        return parseInt(meal.protein, 10) <= parseInt(filter.value, 10);
                    } else if (key === 'minCarbohydrates') {
                        return parseInt(meal.carbohydrates, 10) >= parseInt(filter.value, 10);
                    } else if (key === 'maxCarbohydrates') {
                        return parseInt(meal.carbohydrates, 10) <= parseInt(filter.value, 10);
                    } else if (key === 'minFat') {
                        return parseInt(meal.fat, 10) >= parseInt(filter.value, 10);
                    } else if (key === 'maxFat') {
                        return parseInt(meal.fat, 10) <= parseInt(filter.value, 10);
                    } else if (key === 'minSugar') {
                        return parseInt(meal.sugar, 10) >= parseInt(filter.value, 10);
                    } else if (key === 'maxSugar') {
                        return parseInt(meal.sugar, 10) <= parseInt(filter.value, 10);
                    } else if (key === 'minFiber') {
                        return parseInt(meal.fiber, 10) >= parseInt(filter.value, 10);
                    } else if (key === 'maxFiber') {
                        return parseInt(meal.fiber, 10) <= parseInt(filter.value, 10);
                    } else if (key === 'minSaturatedFat') {
                        return parseInt(meal.saturated_fat, 10) >= parseInt(filter.value, 10);
                    } else if (key === 'maxSaturatedFat') {
                        return parseInt(meal.saturated_fat, 10) <= parseInt(filter.value, 10);
                    }
                    return true;
                });
            });
                setFilteredMeals(updatedMeals);
            };

        applyFilters();
    }, [filters, meals]);

    const handleDeleteMeal = (mealId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta comida?')) {
            // Aquí debes reemplazar con la URL de tu API para eliminar una comida
            fetch(`http://127.0.0.1:8000/nutrition/meals/${mealId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
            })
            .then(response => {
                if (response.ok) {
                    // Actualizar el estado para reflejar la comida eliminada
                    setMeals(meals.filter(meal => meal.id !== mealId));
                } else {
                    console.error('Error al eliminar la comida');
                }
            })
            .catch(error => console.error('Error al eliminar la comida:', error));
        }
    };

    const handleFilterChange = (e) => {
        const { name, value, checked } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: { ...prevFilters[name], value: value, active: checked }
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
        // Reemplaza con la URL de tu API para obtener las comidas
        fetch('http://127.0.0.1:8000/nutrition/meals/', {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            setMeals(data);
            setFilteredMeals(data); // Inicializar las comidas filtradas con todas las comidas
        })
        .catch(error => console.error('Error fetching meals:', error));
    }, []);

    return (
        <div className="container">
            <h1>Lista de Comidas</h1>
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
                    {filteredMeals.map(meal => (
                        <tr key={meal.id} onClick={() => navigate(`/nutrition/meals/${meal.id}`)} style={{cursor: 'pointer'}}>
                            <td>{meal.name}</td>
                            <td>{meal.name}</td>
                            <td>{meal.calories}</td>
                            <td>{meal.protein}</td>
                            <td>{meal.carbohydrates}</td>
                            <td>{meal.fat}</td>
                            <td>{meal.sugar}</td>
                            <td>{meal.fiber}</td>
                            <td>{meal.saturatedFat}</td>
                            <td>
                                <Link to={`/nutrition/edit-meal/${meal.id}`} className="btn btn-primary me-2">Editar</Link>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteMeal(meal.id)} className="btn btn-danger">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredMeals.length === 0 && (
                <div className="alert alert-info" role="alert">
                    No se encontraron comidas que coincidan con los filtros seleccionados.
                </div>
            )}
        </div>
    );
}

export default ListMeal;
