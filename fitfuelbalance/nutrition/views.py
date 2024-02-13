from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .forms import *
from .models import *
from .filters import *
from rest_framework import viewsets
from .serializers import *
from .utils import import_foods_from_csv

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

class FoodViewSet(viewsets.ModelViewSet):
    queryset = Food.objects.all()
    serializer_class = FoodSerializer
    
class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    
class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer
    
class MealViewSet(viewsets.ModelViewSet):
    queryset = Meal.objects.all()
    serializer_class = MealSerializer