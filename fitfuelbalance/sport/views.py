from django.shortcuts import render
from requests import request
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.utils import timezone
import logging
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

class TodayTrainingView(APIView):
    def get(self, request, *args, **kwargs):
        today = timezone.now().date()
        user_id = request.query_params.get('user')  # Obtiene el ID del usuario desde los parámetros de la URL

        if not user_id:
            return Response({'detail': 'Se requiere el ID del usuario.'}, status=status.HTTP_400_BAD_REQUEST)

        # Filtra los entrenamientos por fecha y usuario
        trainings = Training.objects.filter(date=today, user_id=user_id)

        serializer = TrainingSerializer(trainings, many=True)
        return Response(serializer.data)