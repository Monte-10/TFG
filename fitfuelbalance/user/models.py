from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField

# Modelos del usuario

class CustomUser(AbstractUser):
    def __str__(self):
        return self.username

class RegularUser(CustomUser):
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

class Trainer(CustomUser):
    clients = models.ManyToManyField(RegularUser, related_name='clients', null=True, blank=True)
    
    SPECIALTY_CHOICES = [
        ('weight', 'Weight loss'),
        ('muscle', 'Muscle gain'),
        ('strength', 'Strength'),
        ('endurance', 'Endurance'),
        ('flexibility', 'Flexibility'),
        ('other', 'Other'),
    ]
    specialty = models.CharField(max_length=200, blank=True)
    
    TRAINER_TYPE = [
        ('trainer', 'Trainer'),
        ('nutritionist', 'Nutritionist'),
        ('both', 'Trainer and Nutritionist'),
    ]
    trainer_type = models.CharField(max_length=12, choices=TRAINER_TYPE, null=True, blank=True)

class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    #image = models.ImageField(default='default.jpg', upload_to='profile_pics')
    bio = models.TextField(null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], null=True, blank=True)
    
    def __str__(self):
        return f'{self.user.username} Profile'