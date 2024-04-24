from io import BytesIO
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
from rest_framework.permissions import IsAuthenticated
import rest_framework.status as status
from rest_framework.decorators import api_view
from user.models import CustomUser
import datetime

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
    
class DayOptionViewSet(viewsets.ModelViewSet):
    queryset = DayOption.objects.all()
    serializer_class = DayOptionSerializer
    
class WeekOptionViewSet(viewsets.ModelViewSet):
    queryset = WeekOption.objects.all()
    serializer_class = WeekOptionSerializer
    
class OptionViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer
    
class AssignedOptionViewSet(viewsets.ModelViewSet):
    queryset = AssignedOption.objects.all()
    serializer_class = AssignedOptionSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.is_trainer:
                return Response({"error": "Solo los entrenadores pueden crear asignaciones."}, status=status.HTTP_403_FORBIDDEN)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['POST'])
def assignOption(request):
    if not request.user.is_trainer:
        return Response({"error": "Solo los entrenadores pueden crear asignaciones."}, status=status.HTTP_403_FORBIDDEN)
    
    user_id = request.data.get('userId')
    option_id = request.data.get('optionId')

    user = get_object_or_404(CustomUser, id=user_id)
    option = get_object_or_404(Option, id=option_id)

    assignment = AssignedOption.objects.create(
        user=user,
        option=option,
        start_date=timezone.now()
    )

    return Response({
        "message": "Option assigned successfully",
        "assignedOptionId": assignment.id,  # ID de la asignación
        "optionId": option.id,
        "start_date": assignment.start_date.strftime("%Y-%m-%d")
    }, status=status.HTTP_201_CREATED)
    
from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape, letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet
from django.http import HttpResponse
from io import BytesIO
from .models import Option

def generate_option_pdf(request, option_id):
    try:
        option = Option.objects.get(id=option_id)
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{option.name}.pdf"'

        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=landscape(letter))
        elements = []
        styles = getSampleStyleSheet()

        # Días de la semana y comidas
        days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        meals = ['breakfast', 'mid_morning', 'lunch', 'snack', 'dinner']

        # Establecer los títulos para las columnas de opciones
        option_titles = ['Opción A', 'Opción B', 'Opción C']

        for day in days:
            elements.append(Spacer(1, 12))
            day_header = Paragraph(day.capitalize(), styles['Title'])
            elements.append(day_header)
            elements.append(Spacer(1, 12))

            # Incluir los títulos de las opciones en la primera fila de la tabla
            table_data = [['Comida'] + option_titles]

            for meal_name in meals:
                meal_row = [Paragraph(meal_name.capitalize(), styles['Heading3'])]
                for i in range(1, 4):
                    week_option = getattr(option, f'week_option_{["one", "two", "three"][i-1]}')
                    day_option = getattr(week_option, f'{day}_option')
                    meal = getattr(day_option, meal_name)
                    ingredients_paragraph = generate_meal_data(meal, styles)
                    meal_row.append(Paragraph(ingredients_paragraph, styles['BodyText']))
                table_data.append(meal_row)

            # Crear y estilizar la tabla
            t = Table(table_data)
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('BOX', (0,0), (-1,-1), 2, colors.black),
                ('GRID', (0,0), (-1,-1), 1, colors.black),
                ('BACKGROUND', (1, 0), (1, -1), colors.lightblue),
                ('BACKGROUND', (2, 0), (2, -1), colors.lightgreen),
                ('BACKGROUND', (3, 0), (3, -1), colors.lightgrey),
            ]))
            elements.append(t)
            elements.append(PageBreak())

        doc.build(elements)
        pdf = buffer.getvalue()
        buffer.close()
        response.write(pdf)
        return response

    except Option.DoesNotExist:
        return HttpResponse("La opción no existe.", status=404)

def generate_meal_data(meal, styles):
    ingredients_text = []
    for meal_dish in meal.mealdish_set.all():
        dish = meal_dish.dish
        ingredients = dish.dishingredient_set.all()
        dish_text = f'<b>{dish.name}</b>: ' + ', '.join(f"{di.ingredient.food.name} ({di.quantity} porciones)" for di in ingredients)
        ingredients_text.append(dish_text)
    return '<br/>'.join(ingredients_text)
