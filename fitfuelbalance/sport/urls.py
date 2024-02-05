from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'ejercicios', views.EjercicioViewSet)
router.register(r'entrenamientos', views.EntrenamientoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
