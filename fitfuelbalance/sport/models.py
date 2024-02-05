from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Ejercicio(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    tipo = models.CharField(max_length=100)  # Por ejemplo, cardio, fuerza, etc.

    def __str__(self):
        return self.nombre

class Entrenamiento(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255)
    fecha = models.DateField()
    ejercicios = models.ManyToManyField(Ejercicio, through='EntrenamientoEjercicio')

    def __str__(self):
        return self.nombre

class EntrenamientoEjercicio(models.Model):
    entrenamiento = models.ForeignKey(Entrenamiento, on_delete=models.CASCADE)
    ejercicio = models.ForeignKey(Ejercicio, on_delete=models.CASCADE)
    repeticiones = models.IntegerField()
    series = models.IntegerField()
    peso = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
