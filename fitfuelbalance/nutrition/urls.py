from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'foods', views.FoodViewSet)
router.register(r'ingredients', views.IngredientViewSet)
router.register(r'dishes', views.DishViewSet)
router.register(r'meals', views.MealViewSet)
router.register(r'daily_diets', views.DailyDietViewSet)
router.register(r'diet', views.DietViewSet)
router.register(r'dayoptions', views.DayOptionViewSet)
router.register(r'weekoptions', views.WeekOptionViewSet)
router.register(r'options', views.OptionViewSet)
router.register(r'assignedoptions', views.AssignedOptionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('food_create/', views.create_food, name='create_food'),
    path('food_upload/', views.upload_food_csv, name='upload_food_csv'),
    path('food_detail/<int:pk>/', views.food_detail, name='food_detail'),
    path('food_list/', views.food_list, name='food_list'),
    path('dailydiets/today', TodayDailyDietView.as_view(), name='today-dailydiets'),
    path('dailydiets/date/<str:date>', DailyDietByDateView.as_view(), name='dailydiet-by-date'),
    path('assignOption/', views.assignOption, name='assignOption'),
    path('options/<int:option_id>/pdf/', generate_option_pdf, name='generate_option_pdf'),
    path('adapt-diet-or-option/', adapt_diet_or_option, name='adapt_diet_or_option'),
]