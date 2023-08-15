from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from datetime import date

class MuscleGroup(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)  # Una breve descripción del grupo muscular, si es necesario

    def __str__(self):
        return self.name
    
class CustomUser(AbstractUser):
    
    groups = models.ManyToManyField(Group, related_name='customuser_groups')
    user_permissions = models.ManyToManyField(Permission, related_name='customuser_permissions')
    
    GENDER_CHOICES = [
        ('Hombre', 'Hombre'),
        ('Mujer', 'Mujer'),
        ('Otro', 'Otro'),
    ]
    
    GOAL_CHOICES = [
        ('Perder peso', 'Perder peso'),
        ('Ganar masa muscular', 'Ganar masa muscular'),
        ('Mantenerse en forma', 'Mantenerse en forma'),
    ]
    
    LIFE_STYLE_CHOICES = [
        ('Sedentario', 'Sedentario'),
        ('Ligero', 'Ligero'),
        ('Moderado', 'Moderado'),
        ('Activo', 'Activo'),
        ('Muy activo', 'Muy activo'),
    ]
    
    # Extended fields for the user
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    weight = models.FloatField()
    height = models.FloatField()
    age = models.IntegerField()
    waist_measurement = models.FloatField(null=True, blank=True)
    hip_measurement = models.FloatField(null=True, blank=True)
    goal = models.CharField(max_length=50, choices=GOAL_CHOICES)
    health_issues = models.TextField(null=True, blank=True)
    blood_pressure = models.FloatField(null=True, blank=True)
    blood_sugar = models.FloatField(null=True, blank=True)
    daily_water_intake = models.FloatField(null=True, blank=True)
    diet_type = models.CharField(max_length=50, null=True, blank=True)
    calorie_intake = models.FloatField(null=True, blank=True)
    lifestyle = models.CharField(max_length=50, choices=LIFE_STYLE_CHOICES)
    other_goals = models.TextField(null=True, blank=True)
    
class Exercise(models.Model):
    name = models.CharField(max_length=100)
    video_url = models.URLField()
    description = models.TextField()
    muscle_groups = models.ManyToManyField(MuscleGroup)  # Relación con el modelo MuscleGroup
    muscle_image = models.ImageField(upload_to='muscles/')
    duration = models.DurationField(null=True, blank=True)
    timer = models.DurationField(null=True, blank=True)

class Training(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField()
    approximate_duration = models.DurationField()
    muscle_groups = models.ManyToManyField(MuscleGroup)  # Relación con el modelo MuscleGroup, reemplazando el TextField anterior
    note = models.TextField(null=True, blank=True)
    date = models.DateField(default=date.today, null=True, blank=True)
    exercises = models.ManyToManyField(Exercise, through='TrainingExercise')

class TrainingExercise(models.Model):
    training = models.ForeignKey(Training, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    repetitions = models.IntegerField(default=0)
    sets = models.IntegerField(default=0)

class ActivityRecord(models.Model):
    ACTIVITY_TYPE = [
        ('Caminar', 'Caminar'),
        ('Correr', 'Correr'),
        ('Nadar', 'Nadar'),
        ('Bicicleta', 'Bicicleta'),
        ('Ejercicio en casa', 'Ejercicio en casa'),
        ('Ejercicio en gimnasio', 'Ejercicio en gimnasio'),
        ('Otro', 'Otro'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField(default=date.today, null=True, blank=True)
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPE)
    duration = models.DurationField(null=True, blank=True)
    calories_burned = models.FloatField(null=True, blank=True)

class Challenge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    goal = models.TextField(null=True, blank=True)
    participants = models.ManyToManyField(CustomUser, through='UserChallenge')

class UserChallenge(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    completed_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50)  # ej. "completado", "en progreso", etc.