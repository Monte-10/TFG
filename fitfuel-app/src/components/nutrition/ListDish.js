import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function ListDish() {
    const [dishes, setDishes] = useState([]);
    const [filteredDishes, setFilteredDishes] = useState([]);
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

    const handleDeleteDish = (dishId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta comida?')) {
            // Aquí debes reemplazar con la URL de tu API para eliminar una comida
            fetch(`http://127.0.0.1:8000/nutrition/dishes/${dishId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
            })
            .then(response => {
                if (response.ok) {
                    // Actualizar el estado para reflejar la comida eliminada
                    setDishes(dishes.filter(dish => dish.id !== dishId));
                } else {
                    console.error('Error al eliminar la comida');
                }
            })
            .catch(error => console.error('Error al eliminar la comida:', error));
        }
    };

    useEffect(() => {
        // URL para obtener los platos
        fetch('http://127.0.0.1:8000/nutrition/dishes/', {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            setDishes(data);
            setFilteredDishes(data); // Inicializar los platos filtrados con todos los platos
        })
        .catch(error => console.error('Error fetching dishes:', error));
    }, []);

    useEffect(() => {
        // Función para aplicar los filtros
        const applyFilters = () => {
            let updatedDishes = dishes.filter(dish => {
                return Object.entries(filters).every(([key, filter]) => {
                    if (!filter.active) return true;
                    if (key === 'name') {
                        return dish.name.toLowerCase().includes(filter.value.toLowerCase());
                    } else if (['glutenFree', 'lactoseFree', 'vegan', 'vegetarian', 'pescetarian', 'contains_meat', 'contains_vegetables', 'contains_fish_shellfish_canned_preserved', 'cereal', 'pasta_or_rice', 'dairy_yogurt_cheese', 'fruit', 'nuts', 'legume', 'sauce_or_condiment', 'deli_meat', 'bread_or_toast', 'egg', 'special_drink_or_supplement', 'tuber', 'other'].includes(key)) {
                        return filter.value === '' || dish[key] === (filter.value === 'true');
                    } else if (key === 'minCalories') {
                        return parseInt(dish.calories, 10) >= parseInt(filter.value, 10);
                    } else if (key === 'maxCalories') {
                        return parseInt(dish.calories, 10) <= parseInt(filter.value, 10);
                    } else if (key === 'minProtein') {
                        return parseInt(dish.protein, 10) >= parseInt(filter.value, 10);
                    } else if (key === 'maxProtein') {
                        return parseInt(dish.protein, 10) <= parseInt(filter.value, 10);
                    } else if (key === 'minCarbohydrates') {
                        return parseInt(dish.carbohydrates, 10) >= parseInt(filter.value, 10);
                    } else if (key === 'maxCarbohydrates') {
                        return parseInt(dish.carbohydrates, 10) <= parseInt(filter.value, 10);
                    } else if (key === 'minFat') {
                        return parseInt(dish.fat, 10) >= parseInt(filter.value, 10);
                    } else if (key === 'maxFat') {
                        return parseInt(dish.fat, 10) <= parseInt(filter.value, 10);
                    } else if (key === 'minSugar') {
                        return parseInt(dish.sugar, 10) >= parseInt(filter.value, 10);
                    } else if (key === 'maxSugar') {
                        return parseInt(dish.sugar, 10) <= parseInt(filter.value, 10);
                    } else if (key === 'minFiber') {
                        return parseInt(dish.fiber, 10) >= parseInt(filter.value, 10);
                    } else if (key === 'maxFiber') {
                        return parseInt(dish.fiber, 10) <= parseInt(filter.value, 10);
                    } else if (key === 'minSaturatedFat') {
                        return parseInt(dish.saturated_fat, 10) >= parseInt(filter.value, 10);
                    } else if (key === 'maxSaturatedFat') {
                        return parseInt(dish.saturated_fat, 10) <= parseInt(filter.value, 10);
                    }
                    return true;
                });
            });
                setFilteredDishes(updatedDishes);
            };

        applyFilters();
    }, [filters, dishes]);

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

    return (
        <div className="container">
            <h1>Lista de Platos</h1>
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
                    {filteredDishes.map(dish => (
                       <tr key={dish.id} onClick={() => navigate(`/nutrition/dishes/${dish.id}`)} style={{cursor: 'pointer'}}>
                            <td>{dish.name}</td>
                            <td>{dish.calories}</td>
                            <td>{dish.protein}</td>
                            <td>{dish.carbohydrates}</td>
                            <td>{dish.fat}</td>
                            <td>{dish.sugar}</td>
                            <td>{dish.fiber}</td>
                            <td>{dish.saturatedFat}</td>
                            <td>
                                <Link to={`/nutrition/edit-dish/${dish.id}`} className="btn btn-primary me-2">Editar</Link>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteDish(dish.id)} className="btn btn-danger">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredDishes.length === 0 && (
                <div className="alert alert-info" role="alert">
                    No se encontraron platos que coincidan con los filtros seleccionados.
                </div>
            )}
        </div>
    );
}

export default ListDish;
