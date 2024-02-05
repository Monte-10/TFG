from rest_framework import serializers
from .models import Ejercicio, Entrenamiento

class EjercicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ejercicio
        fields = '__all__'

class EntrenamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrenamiento
        fields = '__all__'