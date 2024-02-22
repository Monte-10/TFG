from rest_framework import serializers
from django.db import transaction
from .models import *

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'

class TrainingExerciseSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer(read_only=True)
    exercise_id = serializers.PrimaryKeyRelatedField(queryset=Exercise.objects.all(), source='exercise', write_only=True)
    
    class Meta:
        model = TrainingExercise
        fields = ['exercise', 'exercise_id', 'repetitions', 'sets', 'weight', 'time']

class TrainingSerializer(serializers.ModelSerializer):
    exercises_details = TrainingExerciseSerializer(source='trainingexercise_set', many=True, read_only=True)

    class Meta:
        model = Training
        fields = ['id', 'name', 'exercises_details']

    def create(self, validated_data):
        # Aquí asumimos que 'request' se pasa al contexto del serializer en la vista.
        print("Validated data: ", validated_data)
        user = self.context['request'].user
        if user.is_trainer:  # Asegúrate de que este método o propiedad exista en tu modelo de usuario.
            trainer = user.trainer  # Asumiendo que tienes una relación uno a uno desde User a Trainer.
            validated_data['trainer'] = trainer
            training = Training.objects.create(**validated_data)
            exercises_data = validated_data.pop('exercises_details', [])
            for exercise_data in exercises_data:
                TrainingExercise.objects.create(training=training, **exercise_data)
            return training
        else:
            raise serializers.ValidationError("El usuario no es un entrenador.")

    def update(self, instance, validated_data):
        # Implementa la lógica de actualización aquí si es necesario
        return super().update(instance, validated_data)