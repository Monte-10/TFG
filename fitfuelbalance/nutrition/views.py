from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .forms import *
from .models import *
from .filters import *
from .utils import import_foods_from_csv
from datetime import timedelta
import pandas as pd

def create_food(request):
    if request.method == 'POST':
        form = FoodForm(request.POST)
        if form.is_valid():
            food = form.save()
            messages.success(request, 'Food item created successfully!')
            return redirect('food_detail', pk=food.pk)
    else:
        form = FoodForm()
    return render(request, 'create_food.html', {'form': form})

def upload_food_csv(request):
    if request.method == 'POST':
        form = FoodCSVForm(request.POST, request.FILES)
        if form.is_valid():
            try:
                csv_file = request.FILES['csv_file']
                import_foods_from_csv(csv_file)
                messages.success(request, 'Foods imported successfully!')
            except Exception as e:
                messages.error(request, f'Error importing foods: {e}')
            return redirect('food_list.html')  # Asegúrate de que 'food_list' sea el nombre correcto de tu URL
    else:
        form = FoodCSVForm()
    return render(request, 'upload_food_csv.html', {'form': form})

def food_detail(request, pk):
    food = get_object_or_404(Food, pk=pk)
    return render(request, 'food_detail.html', {'food': food})

def food_list(request):
    f = FoodFilter(request.GET, queryset=Food.objects.all())
    return render(request, 'food_list.html', {'filter': f})

def create_diet(request):
    if request.method == 'POST':
        form = DietForm(request.POST)
        if form.is_valid():
            diet = form.save()
            start_date = diet.start_date
            end_date = diet.end_date
            delta = end_date - start_date
            for i in range(delta.days + 1):
                day = start_date + timedelta(days=i)
                DailyDiet.objects.create(diet=diet, date=day)
            return redirect('dieta_creada_exitosamente_url')  # Reemplaza con la URL correcta
    else:
        form = DietForm()
    return render(request, 'diet_create.html', {'form': form})

def add_meal(request, daily_diet_id):
    daily_diet = get_object_or_404(DailyDiet, id=daily_diet_id)
    if request.method == 'POST':
        form = MealForm(request.POST)
        if form.is_valid():
            meal = form.save(commit=False)
            meal.user = request.user  # Asigna el usuario actual a la comida
            meal.save()
            daily_diet.meals.add(meal)  # Asocia la comida al DailyDiet
            return redirect('daily_diet_detail', daily_diet_id=daily_diet.id)
    else:
        form = MealForm()
    return render(request, 'add_meal.html', {'form': form, 'daily_diet': daily_diet})

def add_dish(request, meal_id):
    meal = get_object_or_404(Meal, id=meal_id, user=request.user)  # Asegura que la Meal pertenezca al usuario
    if request.method == 'POST':
        form = DishForm(request.POST)
        if form.is_valid():
            dish = form.save()
            meal.dishes.add(dish)  # Asocia el Dish a la Meal
            return redirect('meal_detail', meal_id=meal.id)  # Ajusta según tus necesidades
    else:
        form = DishForm()
    return render(request, 'add_dish.html', {'form': form, 'meal': meal})

def add_ingredient(request, dish_id):
    dish = get_object_or_404(Dish, id=dish_id)
    if request.method == 'POST':
        form = IngredientForm(request.POST)
        if form.is_valid():
            ingredient = form.save(commit=False)
            ingredient.save()
            dish.ingredients.add(ingredient)  # Asocia el ingrediente al plato
            return redirect('dish_detail', dish_id=dish.id)  # Asume que tienes una vista para los detalles del plato
    else:
        form = IngredientForm()
    return render(request, 'add_ingredient.html', {'form': form, 'dish': dish})

def diet_detail(request, pk):
    diet = get_object_or_404(Diet, pk=pk)
    return render(request, 'diet_detail.html', {'diet': diet})

def daily_diet_detail(request, pk):
    daily_diet = get_object_or_404(DailyDiet, pk=pk)
    return render(request, 'daily_diet_detail.html', {'daily_diet': daily_diet})

def meal_detail(request, pk):
    meal = get_object_or_404(Meal, pk=pk)
    return render(request, 'meal_detail.html', {'meal': meal})

def edit_diet(request, pk):
    diet = get_object_or_404(Diet, pk=pk)
    if request.method == 'POST':
        form = DietForm(request.POST, instance=diet)
        if form.is_valid():
            diet = form.save()
            return redirect('diet_detail', pk=diet.pk)
    else:
        form = DietForm(instance=diet)
    return render(request, 'edit_diet.html', {'form': form})

def edit_meal(request, pk):
    meal = get_object_or_404(Meal, pk=pk)
    if request.method == 'POST':
        form = MealForm(request.POST, instance=meal)
        if form.is_valid():
            meal = form.save()
            return redirect('meal_detail', pk=meal.pk)
    else:
        form = MealForm(instance=meal)
    return render(request, 'edit_meal.html', {'form': form})

def edit_dish(request, pk):
    dish = get_object_or_404(Dish, pk=pk)
    if request.method == 'POST':
        form = DishForm(request.POST, instance=dish)
        if form.is_valid():
            dish = form.save()
            return redirect('dish_detail', pk=dish.pk)
    else:
        form = DishForm(instance=dish)
    return render(request, 'edit_dish.html', {'form': form})

def delete_diet(request, pk):
    diet = get_object_or_404(Diet, pk=pk)
    if request.method == 'POST':
        diet.delete()
        return redirect('diet_list')  # Asegúrate de que 'diet_list' sea el nombre correcto de tu URL
    return render(request, 'delete_diet.html', {'diet': diet})

def delete_meal(request, pk):
    meal = get_object_or_404(Meal, pk=pk)
    if request.method == 'POST':
        meal.delete()
        return redirect('meal_list')  # Asegúrate de que 'meal_list' sea el nombre correcto de tu URL
    return render(request, 'delete_meal.html', {'meal': meal})

def delete_dish(request, pk):
    dish = get_object_or_404(Dish, pk=pk)
    if request.method == 'POST':
        dish.delete()
        return redirect('dish_list')  # Asegúrate de que 'dish_list' sea el nombre correcto de tu URL
    return render(request, 'delete_dish.html', {'dish': dish})

def nutrition_test(request):
    return render(request, 'nutrition_test.html')