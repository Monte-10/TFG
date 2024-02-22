from django.shortcuts import render
from requests import request
from rest_framework import viewsets
from rest_framework import generics
from .models import *
from .serializers import *

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

class TrainingViewSet(viewsets.ModelViewSet):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer

class TrainingExerciseViewSet(viewsets.ModelViewSet):
    queryset = TrainingExercise.objects.all()
    serializer_class = TrainingExerciseSerializer
    
class TrainingCreateView(generics.CreateAPIView):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer
    
    def get_serializer_context(self):
        context = super(TrainingCreateView, self).get_serializer_context()
        context.update({"request": self.request})
        return context