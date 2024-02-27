from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .forms import *
from .models import *
from .filters import *
from rest_framework import viewsets
from .serializers import *
from .utils import import_foods_from_csv
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

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

@csrf_exempt
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
            return redirect('food_list.html')
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

class DailyDietViewSet(viewsets.ModelViewSet):
    queryset = DailyDiet.objects.all()
    serializer_class = DailyDietSerializer
    
class DietViewSet(viewsets.ModelViewSet):
    queryset = Diet.objects.all()
    serializer_class = DietSerializer
    
class TodayDailyDietView(APIView):
    def get(self, request, *args, **kwargs):
        today = timezone.now().date()
        user = request.user
        
        # Filtra las Dietas por el usuario logueado
        diets = Diet.objects.filter(user=user)
        
        # Encuentra las DailyDiet dentro del rango de fechas de las Dietas filtradas que coincidan con 'hoy'
        today_diets = DailyDiet.objects.filter(diet__in=diets, date=today)
        
        # Serializa y devuelve los resultados
        serializer = DailyDietSerializer(today_diets, many=True)
        return Response(serializer.data)
    
class DailyDietByDateView(APIView):
    def get(self, request, date, *args, **kwargs):
        # Convierte la cadena de fecha en un objeto de fecha
        date = timezone.datetime.strptime(date, '%Y-%m-%d').date()
        user = request.user
        
        diets = Diet.objects.filter(user=user)
        daily_diets = DailyDiet.objects.filter(diet__in=diets, date=date)
        
        serializer = DailyDietSerializer(daily_diets, many=True)
        return Response(serializer.data)