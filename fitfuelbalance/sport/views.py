from django.shortcuts import render
from rest_framework import viewsets
from .models import Ejercicio, Entrenamiento
from .serializers import EjercicioSerializer, EntrenamientoSerializer

class EjercicioViewSet(viewsets.ModelViewSet):
    queryset = Ejercicio.objects.all()
    serializer_class = EjercicioSerializer

class EntrenamientoViewSet(viewsets.ModelViewSet):
    queryset = Entrenamiento.objects.all()
    serializer_class = EntrenamientoSerializer
