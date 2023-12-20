from django.db import models
from django.contrib.auth.models import AbstractUser

# Modelos del usuario

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('trainer', 'Entrenador'),
        ('nutritionist', 'Nutricionista'),
        ('mixed', 'Mixto'),
        ('regularUser', 'Usuario'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='regularUser')