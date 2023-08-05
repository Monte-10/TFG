from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

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
    
    # Extended fields for the user
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    weight = models.FloatField()
    height = models.FloatField()
    age = models.IntegerField()
    waist_measurement = models.FloatField()
    hip_measurement = models.FloatField()
    goal = models.TextField()
    health_issues = models.TextField()
    blood_pressure = models.FloatField()
    blood_sugar = models.FloatField()
    daily_water_intake = models.FloatField()
    diet_type = models.CharField(max_length=50)
    calorie_intake = models.FloatField()
    lifestyle = models.CharField(max_length=50)
    other_goals = models.TextField()
    
class Exercise(models.Model):
    name = models.CharField(max_length=100)
    video_url = models.URLField()
    description = models.TextField()
    muscle_groups = models.ManyToManyField(MuscleGroup)  # Relación con el modelo MuscleGroup
    muscle_image = models.ImageField(upload_to='muscles/')
    duration = models.DurationField()
    timer = models.DurationField()

class Training(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField()
    approximate_duration = models.DurationField()
    muscle_groups = models.ManyToManyField(MuscleGroup)  # Relación con el modelo MuscleGroup, reemplazando el TextField anterior
    note = models.TextField()
    date = models.DateField()
    exercises = models.ManyToManyField(Exercise, through='TrainingExercise')

class TrainingExercise(models.Model):
    training = models.ForeignKey(Training, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    repetitions = models.IntegerField()
    sets = models.IntegerField()

class ActivityRecord(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField()
    activity_type = models.CharField(max_length=50)
    duration = models.DurationField()
    distance = models.FloatField()
    calories_burned = models.FloatField()

class Challenge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    goal = models.TextField()
    participants = models.ManyToManyField(CustomUser, through='UserChallenge')

class UserChallenge(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    completed_date = models.DateField()
    status = models.CharField(max_length=50)  # ej. "completado", "en progreso", etc.