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
    
class UserInfo(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    weekly_exercise = models.IntegerField(null=True, blank=True)

class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    #image = models.ImageField(default='default.jpg', upload_to='profile_pics')
    bio = models.TextField(null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], null=True, blank=True)
    
    def __str__(self):
        return f'{self.user.username} Profile'