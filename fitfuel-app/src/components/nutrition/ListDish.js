import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ListDish.css';

function ListDish() {
    const [dishes, setDishes] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Ajusta este número según sea necesario
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

    const fetchDishes = (page, filters) => {
        const queryParams = new URLSearchParams({
            page: page,
            page_size: itemsPerPage,
            ...filters
        });

        fetch(`${apiUrl}/nutrition/dishes/?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            setDishes(data.results);
            setTotalPages(Math.ceil(data.count / itemsPerPage));
        })
        .catch(error => console.error('Error fetching dishes:', error));
    };

    useEffect(() => {
        fetchDishes(currentPage, filters);
    }, [currentPage, filters]);

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
                    fetchDishes(currentPage, filters);
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

    return (
        <div className="container-listdish">
            <h1 className="mb-4">Lista de Platos</h1>
            <div className="row-listdish mb-4">
                <div className="col-md-2-listdish mb-3">
                    <input
                        type="text"
                        className="form-control-listdish mb-2"
                        placeholder="Filtrar por nombre..."
                        value={filters.name}
                        onChange={handleFilterChange}
                        name="name"
                    />
                    <input
                        type="number"
                        className="form-control-listdish mb-2"
                        placeholder="Calorías mínimas"
                        value={filters.minCalories}
                        onChange={handleFilterChange}
                        name="minCalories"
                    />
                    <input
                        type="number"
                        className="form-control-listdish"
                        placeholder="Calorías máximas"
                        value={filters.maxCalories}
                        onChange={handleFilterChange}
                        name="maxCalories"
                    />
                </div>
                <div className="col-md-2-listdish mb-3">
                    <input
                        type="number"
                        className="form-control-listdish mb-2"
                        placeholder="Proteínas mínimas"
                        value={filters.minProtein}
                        onChange={handleFilterChange}
                        name="minProtein"
                    />
                    <input
                        type="number"
                        className="form-control-listdish mb-2"
                        placeholder="Proteínas máximas"
                        value={filters.maxProtein}
                        onChange={handleFilterChange}
                        name="maxProtein"
                    />
                </div>
                <div className="col-md-2-listdish mb-3">
                    <input
                        type="number"
                        className="form-control-listdish mb-2"
                        placeholder="Carbohidratos mínimos"
                        value={filters.minCarbohydrates}
                        onChange={handleFilterChange}
                        name="minCarbohydrates"
                    />
                    <input
                        type="number"
                        className="form-control-listdish mb-2"
                        placeholder="Carbohidratos máximos"
                        value={filters.maxCarbohydrates}
                        onChange={handleFilterChange}
                        name="maxCarbohydrates"
                    />
                </div>
                <div className="col-md-2-listdish mb-3">
                    <input
                        type="number"
                        className="form-control-listdish mb-2"
                        placeholder="Grasas mínimas"
                        value={filters.minFat}
                        onChange={handleFilterChange}
                        name="minFat"
                    />
                    <input
                        type="number"
                        className="form-control-listdish mb-2"
                        placeholder="Grasas máximas"
                        value={filters.maxFat}
                        onChange={handleFilterChange}
                        name="maxFat"
                    />
                </div>
                <div className="col-md-2-listdish mb-3">
                    <input
                        type="number"
                        className="form-control-listdish mb-2"
                        placeholder="Azúcar mínimo"
                        value={filters.minSugar}
                        onChange={handleFilterChange}
                        name="minSugar"
                    />
                    <input
                        type="number"
                        className="form-control-listdish"
                        placeholder="Azúcar máximo"
                        value={filters.maxSugar}
                        onChange={handleFilterChange}
                        name="maxSugar"
                    />
                </div>
                <div className="col-md-2-listdish mb-3">
                    <input
                        type="number"
                        className="form-control-listdish mb-2"
                        placeholder="Fibra mínima"
                        value={filters.minFiber}
                        onChange={handleFilterChange}
                        name="minFiber"
                    />
                    <input
                        type="number"
                        className="form-control-listdish"
                        placeholder="Fibra máxima"
                        value={filters.maxFiber}
                        onChange={handleFilterChange}
                        name="maxFiber"
                    />
                </div>
                <button className="btn-listdish btn-secondary-listdish mt-3" onClick={resetFilters}>Limpiar Filtros</button>
            </div>

            <table className="table-listdish table-striped-listdish">
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
                    {dishes.map(dish => (
                        <tr key={dish.id} onClick={() => navigate(`/nutrition/dishes/${dish.id}`)} style={{ cursor: 'pointer' }}>
                            <td>{dish.name}</td>
                            <td>{(dish.calories || 0).toFixed(2)}</td>
                            <td>{(dish.protein || 0).toFixed(2)}</td>
                            <td>{(dish.carbohydrates || 0).toFixed(2)}</td>
                            <td>{(dish.fat || 0).toFixed(2)}</td>
                            <td>{(dish.sugar || 0).toFixed(2)}</td>
                            <td>{(dish.fiber || 0).toFixed(2)}</td>
                            <td>{(dish.saturatedFat || 0).toFixed(2)}</td>
                            <td>
                                <Link to={`/nutrition/edit-dish/${dish.id}`} className="btn-listdish btn-primary-listdish me-2" onClick={(e) => e.stopPropagation()}>Editar</Link>
                            </td>
                            <td>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteDish(dish.id); }} className="btn-listdish btn-danger-listdish">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {dishes.length === 0 && (
                <div className="alert-listdish alert-info-listdish" role="alert">
                    No se encontraron platos que coincidan con los filtros seleccionados.
                </div>
            )}

            <div className="pagination-listdish">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="btn-listdish btn-secondary-listdish"
                >
                    Anterior
                </button>
                <span> Página {currentPage} de {totalPages} </span>
                <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="btn-listdish btn-secondary-listdish"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export default ListDish;
