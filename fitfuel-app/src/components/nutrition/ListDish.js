import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function ListDish() {
    const [dishes, setDishes] = useState([]);
    const [filteredDishes, setFilteredDishes] = useState([]);
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

    const handleDeleteDish = (dishId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta comida?')) {
            fetch(`${apiUrl}/nutrition/dishes/${dishId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
            })
            .then(response => {
                if (response.ok) {
                    setDishes(dishes.filter(dish => dish.id !== dishId));
                } else {
                    console.error('Error al eliminar la comida');
                }
            })
            .catch(error => console.error('Error al eliminar la comida:', error));
        }
    };

    useEffect(() => {
        fetch(`${apiUrl}/nutrition/dishes/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            setDishes(data);
            setFilteredDishes(data); // Inicializar los platos filtrados con todos los platos
            setTotalPages(Math.ceil(data.length / itemsPerPage));
        })
        .catch(error => console.error('Error fetching dishes:', error));
    }, [apiUrl, itemsPerPage]);

    useEffect(() => {
        const applyFilters = () => {
            let updatedDishes = dishes.filter(dish => {
                return Object.entries(filters).every(([key, value]) => {
                    if (value === '' || value === false) return true; // Ignore filter if empty or false
                    if (typeof value === 'boolean') {
                        return dish[key] === value;
                    } else if (key.includes('min') || key.includes('max')) {
                        const field = key.replace('min', '').replace('max', '').toLowerCase();
                        if (key.startsWith('min')) {
                            return parseFloat(dish[field]) >= parseFloat(value);
                        } else {
                            return parseFloat(dish[field]) <= parseFloat(value);
                        }
                    } else {
                        return dish[key].toLowerCase().includes(value.toLowerCase());
                    }
                });
            });
            setFilteredDishes(updatedDishes);
            setTotalPages(Math.ceil(updatedDishes.length / itemsPerPage));
        };

        applyFilters();
    }, [filters, dishes, itemsPerPage]);

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

    const currentDishes = filteredDishes.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

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
                        onChange={handleFilterChange}
                        name="name"
                    />
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Calorías mínimas"
                        value={filters.minCalories}
                        onChange={handleFilterChange}
                        name="minCalories"
                    />
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Calorías máximas"
                        value={filters.maxCalories}
                        onChange={handleFilterChange}
                        name="maxCalories"
                    />
                </div>
                <div className="col-md-2 mb-3">
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Proteínas mínimas"
                        value={filters.minProtein}
                        onChange={handleFilterChange}
                        name="minProtein"
                    />
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Proteínas máximas"
                        value={filters.maxProtein}
                        onChange={handleFilterChange}
                        name="maxProtein"
                    />
                </div>
                <div className="col-md-2 mb-3">
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Carbohidratos mínimos"
                        value={filters.minCarbohydrates}
                        onChange={handleFilterChange}
                        name="minCarbohydrates"
                    />
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Carbohidratos máximos"
                        value={filters.maxCarbohydrates}
                        onChange={handleFilterChange}
                        name="maxCarbohydrates"
                    />
                </div>
                <div className="col-md-2 mb-3">
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Grasas mínimas"
                        value={filters.minFat}
                        onChange={handleFilterChange}
                        name="minFat"
                    />
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Grasas máximas"
                        value={filters.maxFat}
                        onChange={handleFilterChange}
                        name="maxFat"
                    />
                </div>
                <div className="col-md-2 mb-3">
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Azúcar mínimo"
                        value={filters.minSugar}
                        onChange={handleFilterChange}
                        name="minSugar"
                    />
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Azúcar máximo"
                        value={filters.maxSugar}
                        onChange={handleFilterChange}
                        name="maxSugar"
                    />
                </div>
                <div className="col-md-2 mb-3">
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Fibra mínima"
                        value={filters.minFiber}
                        onChange={handleFilterChange}
                        name="minFiber"
                    />
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Fibra máxima"
                        value={filters.maxFiber}
                        onChange={handleFilterChange}
                        name="maxFiber"
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
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {currentDishes.map(dish => (
                        <tr key={dish.id} onClick={() => navigate(`/nutrition/dishes/${dish.id}`)} style={{ cursor: 'pointer' }}>
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
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteDish(dish.id); }} className="btn btn-danger">Eliminar</button>
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

            <div className="pagination">
                <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="btn btn-secondary"
                >
                    Anterior
                </button>
                <span> Página {currentPage + 1} de {totalPages} </span>
                <button
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="btn btn-secondary"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export default ListDish;
