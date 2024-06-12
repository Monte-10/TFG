from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import *

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'age', 'gender', 'image']

class TrainerSerializer(serializers.ModelSerializer):
    clients = serializers.SlugRelatedField(slug_field='username', queryset=RegularUser.objects.all(), many=True)
    class Meta:
        model = Trainer
        fields = ['id', 'username', 'specialties', 'trainer_type', 'communication_email', 'phone', 'clients']

class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = ['id', 'name']

class RegularUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = RegularUser
        fields = [
            'username', 'id', 'weight', 'height', 'neck', 'shoulder', 'chest', 'waist',
            'hip', 'arm', 'glute', 'upper_leg', 'middle_leg', 'lower_leg',
            'communication_email', 'phone', 'personal_trainer', 'profile'
        ]
        
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class RegularUserSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegularUser
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        if RegularUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso.")
        return value

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        user = RegularUser.objects.create(**validated_data)
        Profile.objects.create(user=user)  # Aquí se crea el perfil
        return user

class TrainerSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        if Trainer.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso.")
        return value

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        user = Trainer.objects.create(**validated_data)
        Profile.objects.create(user=user)  # Aquí se crea el perfil
        return user

    
class TrainingRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingRequest
        fields = ['id', 'regular_user', 'trainer', 'is_accepted', 'description', 'email', 'phone']
        read_only_fields = ['id', 'is_accepted']