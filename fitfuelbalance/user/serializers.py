from rest_framework import serializers
from .models import *

class RegularUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegularUser
        fields = '__all__'
        
class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = '__all__'