from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'foods', views.FoodViewSet)
router.register(r'ingredients', views.IngredientViewSet)
router.register(r'dishes', views.DishViewSet)
router.register(r'meals', views.MealViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('food_create/', views.create_food, name='create_food'),
    path('food_upload/', views.upload_food_csv, name='upload_food_csv'),
    path('food_detail/<int:pk>/', views.food_detail, name='food_detail'),
    path('food_list/', views.food_list, name='food_list'),
]