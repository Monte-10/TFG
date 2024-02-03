from django.urls import path
from . import views

urlpatterns = [
    path('food_create/', views.create_food, name='create_food'),
    path('food_upload/', views.upload_food_csv, name='upload_food_csv'),
    path('food_detail/<int:pk>/', views.food_detail, name='food_detail'),
    path('food_list/', views.food_list, name='food_list'),
    path('diet/create/', views.create_diet, name='create_diet'),
    path('diet/detail/<int:pk>/', views.diet_detail, name='diet_detail'),
    path('meal/add/<int:daily_diet_id>/', views.add_meal, name='add_meal'),
    path('dish/add/<int:meal_id>/', views.add_dish, name='add_dish'),
    path('dailydiet/detail/<int:pk>/', views.daily_diet_detail, name='daily_diet_detail'),
    path('meal/detail/<int:pk>/', views.meal_detail, name='meal_detail'),
    path('diet/edit/<int:pk>/', views.edit_diet, name='edit_diet'),
    path('meal/edit/<int:pk>/', views.edit_meal, name='edit_meal'),
    path('dish/edit/<int:pk>/', views.edit_dish, name='edit_dish'),
    path('diet/delete/<int:pk>/', views.delete_diet, name='delete_diet'),
    path('meal/delete/<int:pk>/', views.delete_meal, name='delete_meal'),
    path('dish/delete/<int:pk>/', views.delete_dish, name='delete_dish'),
]