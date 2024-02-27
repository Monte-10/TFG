from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import *

router = DefaultRouter()
router.register(r'exercises', views.ExerciseViewSet)
router.register(r'trainings', views.TrainingViewSet)
router.register(r'training_exercises', views.TrainingExerciseViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('trainings/today', TodayTrainingView.as_view(), name='today-trainings'),
    path('trainings/date/<str:date>', TrainingByDateView.as_view(), name='training-by-date'),
]
