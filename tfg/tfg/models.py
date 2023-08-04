from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Entrenamiento(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="entrenamientos")
    fecha = models.DateField(auto_now_add=True)
    duracion = models.TimeField()
    ejercicios = 
    comentario = models.CharField(max_length=200, blank=True)
    def __str__(self):
        return f"{self.user} {self.fecha} {self.distancia} {self.tiempo} {self.ritmo} {self.comentario}"