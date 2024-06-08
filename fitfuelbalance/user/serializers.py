from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import *

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'age', 'gender', 'image']

class TrainerSerializer(serializers.ModelSerializer):
    specialties = serializers.PrimaryKeyRelatedField(queryset=Specialty.objects.all(), many=True)

    class Meta:
        model = Trainer
        fields = ['username', 'specialties', 'trainer_type']

class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = ['id', 'name']

class RegularUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegularUser
        fields = ['username', 'weight', 'height', 'neck', 'shoulder', 'chest', 'waist', 'hip', 'arm', 'glute', 'upper_leg', 'middle_leg', 'lower_leg']

        
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class RegularUserSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegularUser
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return RegularUser.objects.create(**validated_data)
    
class TrainerSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return Trainer.objects.create(**validated_data)