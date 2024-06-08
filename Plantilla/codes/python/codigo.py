trainings = Training.objects.all()

#####

DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': 'fitfuelbalance_db',
                'USER': 'dbuser',
                'PASSWORD': 'password',
                'HOST': 'localhost',
                'PORT': '5432',
            }
}
           
##### 

response = requests.get('https://fitfuelbalance.onrender.com/nutrition/foods/')

#####

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}

#####

from django.urls import path, include
    from rest_framework.routers import DefaultRouter
    
    router = DefaultRouter()
    router.register(r'foods', views.FoodViewSet)
    router.register(r'assigned_options', views.AssignedOptionViewSet)
    
    urlpatterns = [
        path('', include(router.urls)),
        path('assign_option/', views.assignOption, name='assign_option'),
    ]

#####  
    
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

#####
        
class FoodSerializer(serializers.ModelSerializer):
        class Meta:
            model = Food
            fields = '__all__'

class OptionSerializer(serializers.ModelSerializer):
    week_option_one = serializers.PrimaryKeyRelatedField(queryset=WeekOption.objects.all())
    week_option_two = serializers.PrimaryKeyRelatedField(queryset=WeekOption.objects.all())
    week_option_three = serializers.PrimaryKeyRelatedField(queryset=WeekOption.objects.all())

    class Meta:
        model = Option
        fields = ['id', 'name', 'week_option_one', 'week_option_two', 'week_option_three']
        read_only_fields = ['trainer']

    def create(self, validated_data):
        user = self.context['request'].user
        if user.is_trainer:
            trainer = user.trainer
        else:
            raise serializers.ValidationError("El usuario no está autorizado para crear opciones.")

        # Crea la instancia de Option incluyendo el trainer obtenido del contexto
        option = Option.objects.create(**validated_data, trainer=trainer)
        return option
        
#####   
            
class LoginView(APIView):
        authentication_classes = []  # No authentication required
        permission_classes = []  # No permission required
    
        def post(self, request, *args, **kwargs):
            username = request.data.get('username')
            password = request.data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                token, created = Token.objects.get_or_create(user=user)
                return Response(
                    {'token': token.key, 'userId': user.id}, 
                    status=status.HTTP_200_OK)
            else:
                return Response(
                    {'detail': 'Invalid Credentials'}, 
                    status=status.HTTP_401_UNAUTHORIZED)
                
#####
                      
class Option(models.Model):
    trainer = models.ForeignKey('user.Trainer',
     on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    week_option_one = models.ForeignKey(
        WeekOption, 
        related_name='week_option_one', on_delete=models.CASCADE)
    week_option_two = models.ForeignKey(
        WeekOption, related_name='week_option_two',
         on_delete=models.CASCADE)
    week_option_three = models.ForeignKey(
        WeekOption, related_name='week_option_three',
         on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name

class Training(models.Model):
    trainer = models.ForeignKey(
        'user.Trainer', on_delete=models.CASCADE,
         related_name='trainer')
    name = models.CharField(max_length=255)
    exercises = models.ManyToManyField(Exercise, through='TrainingExercise')
    date = models.DateField()
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='user')

    def __str__(self):
        return self.name
        
#####
    
from .settings import *
# Configuración de la base de datos para pruebas
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
        'ATOMIC_REQUESTS': True,
    }
}
# Otros ajustes específicos para pruebas
SECRET_KEY = 'test-secret-key'
DEBUG = True
# Usar el backend de contraseñas de hashing rápido
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]
# Desactivar middleware y aplicaciones en pruebas
MIDDLEWARE = [mw for mw in MIDDLEWARE if mw not in 
['debug_toolbar.middleware.DebugToolbarMiddleware']]
INSTALLED_APPS = [app for 
app in INSTALLED_APPS if app != 'debug_toolbar']

# Configuración de REST framework para pruebas
REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'] = (
    'rest_framework.authentication.SessionAuthentication',
    'rest_framework.authentication.BasicAuthentication',
)
# Configuración de CORS para pruebas (si es necesario)
CORS_ALLOW_ALL_ORIGINS = True
# Configuración de las rutas de archivos estáticos
STATIC_URL = '/static/'
MEDIA_URL = '/media/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static_test')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media_test')
# Configuración de la caché para pruebas
CACHES = {
    'default': {
    'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',}}

#####

def setUp(self):
    self.client = APIClient(enforce_csrf_checks=False)
    self.user_data = {
        'username': 'testuser',
        'password': 'TestPassword123',
        'email': 'testuser@example.com',
        'first_name': 'Test',
        'last_name': 'User',
    }
    self.trainer_data = {
        'username': 'testtrainer',
        'password': 'TestPassword123',
        'email': 'testtrainer@example.com',
        'first_name': 'Test',
        'last_name': 'Trainer',
        'trainer_type': 'trainer'
    }

#####

def test_create_regular_user(self):
    url = reverse('regularuser_signup')
    response = self.client.post(url, self.user_data, format='json')
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.assertEqual(CustomUser.objects.count(), 1)
    self.assertEqual(CustomUser.objects.get().username, 'testuser')

def test_create_trainer(self):
    url = reverse('trainer_signup')
    response = self.client.post(url, self.trainer_data, format='json')
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.assertEqual(CustomUser.objects.count(), 1)
    self.assertEqual(CustomUser.objects.get().username, 'testtrainer')

def test_login_regular_user(self):
    self.test_create_regular_user()
    url = reverse('frontlogin')
    response = self.client.post(url, self.user_data, format='json')
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertIn('token', response.data)

def test_search_trainer(self):
    self.test_create_regular_user()
    self.test_create_trainer()
    url = reverse('frontlogin')
    response = self.client.post(url, self.user_data, format='json')
    token = response.data['token']
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
    search_url = reverse('search_trainer')
    response = self.client.get(search_url, {'trainer_type': 'trainer'})
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertGreaterEqual(len(response.data), 1)
    
#####

def setUp(self):
    self.trainer_data = {
        'username': 'testtrainer',
        'password': 'TestPassword123',
        'email': 'testtrainer@example.com',
        'first_name': 'Test',
        'last_name': 'Trainer',
    }
    self.trainer = Trainer.objects.create_user(**self.trainer_data)
    self.client.force_authenticate(user=self.trainer)

    self.exercise_data = {
        'name': 'Push Up',
        'description': 'Push up exercise',
        'type': 'FUERZA'
    }

    self.training_data = {
        'trainer': self.trainer,
        'name': 'Morning Workout',
        'date': date.today(),
    }

    self.user_data = {
        'username': 'testuser',
        'password': 'TestPassword123',
        'email': 'testuser@example.com',
        'first_name': 'Test',
        'last_name': 'User',
    }
    self.user = CustomUser.objects.create_user(**self.user_data)

#####

def test_create_exercise(self):
    url = reverse('exercise-list')
    response = self.client.post(url, self.exercise_data, format='json')
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.assertEqual(Exercise.objects.count(), 1)
    self.assertEqual(Exercise.objects.get().name, 'Push Up')

def test_create_training_exercise(self):
    exercise = Exercise.objects.create(**self.exercise_data)
    training = Training.objects.create(trainer=self.trainer,
     name='Morning Workout', date=date.today(), user=self.user)
    training_exercise_data = {
        'training': training.id,
        'exercise': exercise.id,
        'repetitions': 10,
        'sets': 3,
        'weight': 50,
    }
    url = reverse('trainingexercise-list')
    response = self.client.post(url, training_exercise_data,
     format='json')
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.assertEqual(TrainingExercise.objects.count(), 1)
    self.assertEqual(TrainingExercise.objects.get().repetitions, 10)

def test_get_today_trainings(self):
    training = Training.objects.create(trainer=self.trainer,
     name='Morning Workout', date=date.today(), user=self.user)
    url = reverse('today-trainings')
    response = self.client.get(url, {'user': self.user.id})
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(len(response.data), 1)
    self.assertEqual(response.data[0]['name'], 'Morning Workout')
    
#####
    
def setUp(self):
    self.trainer_data = {
        'username': 'testtrainer',
        'password': 'TestPassword123',
        'email': 'testtrainer@example.com',
        'first_name': 'Test',
        'last_name': 'Trainer',
    }
    self.trainer = Trainer.objects.create_user(**self.trainer_data)
    self.client.force_authenticate(user=self.trainer)

    self.food_data = {
        'name': 'Apple',
        'unit_weight': 100,
        'calories': 52,
        'protein': 0.26,
        'carbohydrates': 14,
        'sugar': 10,
        'fiber': 2.4,
        'fat': 0.17,
        'saturated_fat': 0.03,
    }

    self.ingredient_data = {
        'name': 'Apple Slice',
        'food': Food.objects.create(**self.food_data).id,
        'quantity': 150
    }

    self.user_data = {
        'username': 'testuser',
        'password': 'TestPassword123',
        'email': 'testuser@example.com',
        'first_name': 'Test',
        'last_name': 'User',
    }
    self.user = CustomUser.objects.create_user(**self.user_data)
    
#####

def test_create_food(self):
    url = reverse('food-list')
    response = self.client.post(url, self.food_data, format='json')
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.assertEqual(Food.objects.count(), 1)
    self.assertEqual(Food.objects.get().name, 'Apple')

def test_create_dish(self):
    ingredient = Ingredient.objects.create(**self.ingredient_data)
    dish_data = {
        'user': self.user.id,
        'name': 'Apple Salad',
        'ingredients': [ingredient.id]
    }
    url = reverse('dish-list')
    response = self.client.post(url, dish_data, format='json')
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.assertEqual(Dish.objects.count(), 1)
    self.assertEqual(Dish.objects.get().name, 'Apple Salad')

def test_get_today_dailydiets(self):
    diet = Diet.objects.create(user=self.user, name='Weight Loss', 
    start_date=timezone.now().date(), 
    end_date=timezone.now().date() + timedelta(days=7))
    daily_diet = DailyDiet.objects.create(diet=diet,
     date=timezone.now().date())
    daily_diet.meals.add(Meal.objects.create(user=self.user,
     name='Breakfast'))
    url = reverse('today-dailydiets')
    self.client.force_authenticate(user=self.user)
    response = self.client.get(url)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(len(response.data), 1)
    self.assertEqual(response.data[0]['diet'], diet.id)
    
#####