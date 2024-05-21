from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import *

class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = ['id', 'name']

class TrainerSerializer(serializers.ModelSerializer):
    specialties = SpecialtySerializer(many=True)

    class Meta:
        model = Trainer
        fields = ['id', 'username', 'email', 'specialties', 'trainer_type']

    def update(self, instance, validated_data):
        specialties_data = validated_data.pop('specialties', None)
        if specialties_data:
            specialties = [Specialty.objects.get(id=s['id']) for s in specialties_data]
            instance.specialties.set(specialties)
        return super().update(instance, validated_data)

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'age', 'gender', 'image']

class RegularUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegularUser
        fields = '__all__'
        
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