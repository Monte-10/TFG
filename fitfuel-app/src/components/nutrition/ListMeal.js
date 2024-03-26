import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ListMeal() {
    const [meals, setMeals] = useState([]);
    const [filteredMeals, setFilteredMeals] = useState([]);
    const [filters, setFilters] = useState({
        name: { value: '', active: false },
        minCalories: { value: '', active: false },
        maxCalories: { value: '', active: false },
        minProtein: { value: '', active: false },
        maxProtein: { value: '', active: false },
        minCarbohydrates: { value: '', active: false },
        maxCarbohydrates: { value: '', active: false },
        minFat: { value: '', active: false },
        maxFat: { value: '', active: false },
        minSugar: { value: '', active: false },
        maxSugar: { value: '', active: false },
        minFiber: { value: '', active: false },
        maxFiber: { value: '', active: false },
        minSaturatedFat: { value: '', active: false },
        maxSaturatedFat: { value: '', active: false },
        glutenFree: { value: '', active: false },
        lactoseFree: { value: '', active: false },
        vegan: { value: '', active: false },
        vegetarian: { value: '', active: false },
        pescetarian: { value: '', active: false },
        contains_meat: { value: '', active: false },
        contains_vegetables: { value: '', active: false },
        contains_fish_shellfish_canned_preserved: { value: '', active: false },
        cereal: { value: '', active: false },
        pasta_or_rice: { value: '', active: false },
        dairy_yogurt_cheese: { value: '', active: false },
        fruit: { value: '', active: false },
        nuts: { value: '', active: false },
        legume: { value: '', active: false },
        sauce_or_condiment: { value: '', active: false },
        deli_meat: { value: '', active: false },
        bread_or_toast: { value: '', active: false },
        egg: { value: '', active: false },
        special_drink_or_supplement: { value: '', active: false },
        tuber: { value: '', active: false },
        other: { value: '', active: false }
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

    const handleFilterChange = (e) => {
        const { name, value, checked } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: { ...prevFilters[name], value: value, active: checked }
        }));
    };

    const resetFilters = () => {
        setFilters({
            name: { value: '', active: false },
            minCalories: { value: '', active: false },
            maxCalories: { value: '', active: false },
            minProtein: { value: '', active: false },
            maxProtein: { value: '', active: false },
            minCarbohydrates: { value: '', active: false },
            maxCarbohydrates: { value: '', active: false },
            minFat: { value: '', active: false },
            maxFat: { value: '', active: false },
            minSugar: { value: '', active: false },
            maxSugar: { value: '', active: false },
            minFiber: { value: '', active: false },
            maxFiber: { value: '', active: false },
            minSaturatedFat: { value: '', active: false },
            maxSaturatedFat: { value: '', active: false },
            glutenFree: { value: '', active: false },
            lactoseFree: { value: '', active: false },
            vegan: { value: '', active: false },
            vegetarian: { value: '', active: false },
            pescetarian: { value: '', active: false },
            contains_meat: { value: '', active: false },
            contains_vegetables: { value: '', active: false },
            contains_fish_shellfish_canned_preserved: { value: '', active: false },
            cereal: { value: '', active: false },
            pasta_or_rice: { value: '', active: false },
            dairy_yogurt_cheese: { value: '', active: false },
            fruit: { value: '', active: false },
            nuts: { value: '', active: false },
            legume: { value: '', active: false },
            sauce_or_condiment: { value: '', active: false },
            deli_meat: { value: '', active: false },
            bread_or_toast: { value: '', active: false },
            egg: { value: '', active: false },
            special_drink_or_supplement: { value: '', active: false },
            tuber: { value: '', active: false },
            other: { value: '', active: false }
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
            <div className="mb-3">
            <div className="filters mb-3">
                {/* Filtro de nombre */}
                <div className="mb-2">
                    <input
                        type="text"
                        placeholder="Filtrar por nombre..."
                        value={filters.name.value}
                        onChange={(e) => handleFilterChange({ target: { name: 'name', value: e.target.value, checked: e.target.value !== '' } })}
                    />
                </div>
                
                {/* Filtro de calorías */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.maxCalories.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'maxCalories', value: e.target.value, checked: true } })}
                        name="maxCalories"
                    /> Filtrar por calorías máximas
                    <input
                        type="number"
                        value={filters.maxCalories.value}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxCalories', value: e.target.value, checked: true } })}
                    />
                </div>

                {/* Filtro de calorías mínimas */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.minCalories.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'minCalories', value: e.target.value, checked: true } })}
                        name="minCalories"
                    /> Filtrar por calorías mínimas
                    <input
                        type="number"
                        value={filters.minCalories.value}
                        onChange={(e) => handleFilterChange({ target: { name: 'minCalories', value: e.target.value, checked: true } })}
                    />
                </div>

                {/* Filtro de proteínas */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.maxProtein.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'maxProtein', value: e.target.value, checked: true } })}
                        name="maxProtein"
                    /> Filtrar por proteínas máximas
                    <input
                        type="number"
                        value={filters.maxProtein.value}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxProtein', value: e.target.value, checked: true } })}
                    />
                </div>

                {/* Filtro de proteínas mínimas */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.minProtein.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'minProtein', value: e.target.value, checked: true } })}
                        name="minProtein"
                    /> Filtrar por proteínas mínimas
                    <input
                        type="number"
                        value={filters.minProtein.value}
                        onChange={(e) => handleFilterChange({ target: { name: 'minProtein', value: e.target.value, checked: true } })}
                    />
                </div>

                {/* Filtro de carbohidratos */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.maxCarbohydrates.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'maxCarbohydrates', value: e.target.value, checked: true } })}
                        name="maxCarbohydrates"
                    /> Filtrar por carbohidratos máximos
                    <input
                        type="number"
                        value={filters.maxCarbohydrates.value}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxCarbohydrates', value: e.target.value, checked: true } })}
                    />
                </div>

                {/* Filtro de carbohidratos mínimos */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.minCarbohydrates.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'minCarbohydrates', value: e.target.value, checked: true } })}
                        name="minCarbohydrates"
                    /> Filtrar por carbohidratos mínimos
                    <input
                        type="number"
                        value={filters.minCarbohydrates.value}
                        onChange={(e) => handleFilterChange({ target: { name: 'minCarbohydrates', value: e.target.value, checked: true } })}
                    />
                </div>

                {/* Filtro de grasas */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.maxFat.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'maxFat', value: e.target.value, checked: true } })}
                        name="maxFat"
                    /> Filtrar por grasas máximas
                    <input
                        type="number"
                        value={filters.maxFat.value}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxFat', value: e.target.value, checked: true } })}
                    />
                </div>

                {/* Filtro de grasas mínimas */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.minFat.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'minFat', value: e.target.value, checked: true } })}
                        name="minFat"
                    /> Filtrar por grasas mínimas
                    <input
                        type="number"
                        value={filters.minFat.value}
                        onChange={(e) => handleFilterChange({ target: { name: 'minFat', value: e.target.value, checked: true } })}
                    />
                </div>

                {/* Filtro de azúcar */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.maxSugar.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'maxSugar', value: e.target.value, checked: true } })}
                        name="maxSugar"
                    /> Filtrar por azúcar máximo
                    <input
                        type="number"
                        value={filters.maxSugar.value}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxSugar', value: e.target.value, checked: true } })}
                    />
                </div>

                {/* Filtro de azúcar mínimo */}
                <div className="mb-2"></div>
                    <input 
                        type="checkbox" 
                        checked={filters.minSugar.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'minSugar', value: e.target.value, checked: true } })}
                        name="minSugar"
                    /> Filtrar por azúcar mínimo
                    <input
                        type="number"
                        value={filters.minSugar.value}
                        onChange={(e) => handleFilterChange({ target: { name: 'minSugar', value: e.target.value, checked: true } })}
                    />
                </div>

                {/* Filtro de fibra mínima */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.minFiber.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'minFiber', value: e.target.value, checked: true } })}
                        name="minFiber"
                    /> Filtrar por fibra mínima
                    <input
                        type="number"
                        value={filters.minFiber.value}
                        onChange={(e) => handleFilterChange({ target: { name: 'minFiber', value: e.target.value, checked: true } })}
                    />
                </div>

                {/* Filtro de fibra máxima */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.maxFiber.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'maxFiber', value: e.target.value, checked: true } })}
                        name="maxFiber"
                    /> Filtrar por fibra máxima
                    <input
                        type="number"
                        value={filters.maxFiber.value}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxFiber', value: e.target.value, checked: true } })}
                    />
                </div>

                {/* Filtro de grasas saturadas mínimas */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.minSaturatedFat.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'minSaturatedFat', value: e.target.value, checked: true } })}
                        name="minSaturatedFat"
                    /> Filtrar por grasas saturadas mínimas
                    <input
                        type="number"
                        value={filters.minSaturatedFat.value}
                        onChange={(e) => handleFilterChange({ target: { name: 'minSaturatedFat', value: e.target.value, checked: true } })}
                    />
                </div>

                {/* Filtro de grasas saturadas máximas */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.maxSaturatedFat.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'maxSaturatedFat', value: e.target.value, checked: true } })}
                        name="maxSaturatedFat"
                    /> Filtrar por grasas saturadas máximas
                    <input
                        type="number"
                        value={filters.maxSaturatedFat.value}
                        onChange={(e) => handleFilterChange({ target: { name: 'maxSaturatedFat', value: e.target.value, checked: true } })}
                    />
                </div>

                {/* Filtro de sin gluten */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.glutenFree.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'glutenFree', value: e.target.value, checked: true } })}
                        name="glutenFree"
                    /> Filtrar por sin gluten
                </div>

                {/* Filtro de sin lactosa */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.lactoseFree.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'lactoseFree', value: e.target.value, checked: true } })}
                        name="lactoseFree"
                    /> Filtrar por sin lactosa
                </div>

                {/* Filtro de vegano */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.vegan.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'vegan', value: e.target.value, checked: true } })}
                        name="vegan"
                    /> Filtrar por vegano
                </div>

                {/* Filtro de vegetariano */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.vegetarian.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'vegetarian', value: e.target.value, checked: true } })}
                        name="vegetarian"
                    /> Filtrar por vegetariano
                </div>

                {/* Filtro de pescetariano */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.pescetarian.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'pescetarian', value: e.target.value, checked: true } })}
                        name="pescetarian"
                    /> Filtrar por pescetariano
                </div>

                {/* Filtro de contiene carne */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.contains_meat.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'contains_meat', value: e.target.value, checked: true } })}
                        name="contains_meat"
                    /> Filtrar por contiene carne
                </div>

                {/* Filtro de contiene vegetales */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.contains_vegetables.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'contains_vegetables', value: e.target.value, checked: true } })}
                        name="contains_vegetables"
                    /> Filtrar por contiene vegetales
                </div>

                {/* Filtro de contiene pescado/mariscos/enlatados/preservados */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.contains_fish_shellfish_canned_preserved.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'contains_fish_shellfish_canned_preserved', value: e.target.value, checked: true } })}
                        name="contains_fish_shellfish_canned_preserved"
                    /> Filtrar por contiene pescado/mariscos/enlatados/preservados
                </div>

                {/* Filtro de cereal */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.cereal.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'cereal', value: e.target.value, checked: true } })}
                        name="cereal"
                    /> Filtrar por cereal
                </div>

                {/* Filtro de pasta o arroz */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.pasta_or_rice.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'pasta_or_rice', value: e.target.value, checked: true } })}
                        name="pasta_or_rice"
                    /> Filtrar por pasta o arroz
                </div>

                {/* Filtro de lácteos/yogur/queso */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.dairy_yogurt_cheese.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'dairy_yogurt_cheese', value: e.target.value, checked: true } })}
                        name="dairy_yogurt_cheese"
                    /> Filtrar por lácteos/yogur/queso
                </div>

                {/* Filtro de fruta */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.fruit.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'fruit', value: e.target.value, checked: true } })}
                        name="fruit"
                    /> Filtrar por fruta
                </div>

                {/* Filtro de frutos secos */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.nuts.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'nuts', value: e.target.value, checked: true } })}
                        name="nuts"
                    /> Filtrar por frutos secos
                </div>

                {/* Filtro de legumbres */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.legume.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'legume', value: e.target.value, checked: true } })}
                        name="legume"
                    /> Filtrar por legumbres
                </div>

                {/* Filtro de salsas o condimentos */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.sauce_or_condiment.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'sauce_or_condiment', value: e.target.value, checked: true } })}
                        name="sauce_or_condiment"
                    /> Filtrar por salsas o condimentos
                </div>

                {/* Filtro de embutidos */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.deli_meat.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'deli_meat', value: e.target.value, checked: true } })}
                        name="deli_meat"
                    /> Filtrar por embutidos
                </div>

                {/* Filtro de pan o tostadas */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.bread_or_toast.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'bread_or_toast', value: e.target.value, checked: true } })}
                        name="bread_or_toast"
                    /> Filtrar por pan o tostadas
                </div>

                {/* Filtro de huevo */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.egg.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'egg', value: e.target.value, checked: true } })}
                        name="egg"
                    /> Filtrar por huevo
                </div>

                {/* Filtro de bebida especial o suplemento */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.special_drink_or_supplement.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'special_drink_or_supplement', value: e.target.value, checked: true } })}
                        name="special_drink_or_supplement"
                    /> Filtrar por bebida especial o suplemento
                </div>

                {/* Filtro de tubérculo */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.tuber.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'tuber', value: e.target.value, checked: true } })}
                        name="tuber"
                    /> Filtrar por tubérculo
                </div>

                {/* Filtro de otros */}
                <div className="mb-2">
                    <input 
                        type="checkbox" 
                        checked={filters.other.active} 
                        onChange={(e) => handleFilterChange({ target: { name: 'other', value: e.target.value, checked: true } })}
                        name="other"
                    /> Filtrar por otros
                </div>
                <button className="btn btn-secondary mt-2" onClick={resetFilters}>Limpiar Filtros</button>
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
