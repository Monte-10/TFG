from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=100)
    gender = models.CharField(max_length=10) # Podría implementarse como una picklist
    weight = models.FloatField()
    height = models.FloatField()
    age = models.IntegerField()
    # waist_measurement = models.FloatField()
    # hip_measurement = models.FloatField()
    # Quizas más campos como tension arterial, etc.
    
class Exercise(models.Model):
    name = models.CharField(max_length=100)
    video_url = models.URLField() # Podría ser un archivo de video
    description = models.TextField()
    # Quizas más campos como dificultad, etc.
    
class Training(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    duration = models.DurationField()
    muscle_group = models.CharField(max_length=100)
    exercises = models.ManyToManyField(Exercise)
    annotation = models.TextField()
    # Quizas más campos como dificultad, etc.
    
class Challenge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    # Quizas más campos relacionados con el desafío