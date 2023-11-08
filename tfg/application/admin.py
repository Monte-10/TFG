from django.contrib import admin
from .models import CustomUser, Exercise, Training, TrainingExercise, ActivityRecord, Challenge, UserChallenge, MuscleGroup, AlimentoBase

# ModelAdmin personalizado para CustomUser
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'gender', 'age', 'entrenador')
    search_fields = ('username', 'email', 'entrenador')
    

# ModelAdmin personalizado para Exercise
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# ModelAdmin personalizado para Training
class TrainingAdmin(admin.ModelAdmin):
    list_display = ('name','date',)
    search_fields = ('name',)

# ModelAdmin personalizado para Challenge
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_date', 'end_date',)
    search_fields = ('name',)
    
class MuscleGroupAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    
class AlimentoBaseAdmin(admin.ModelAdmin):
    list_display = ('name','proteina','grasa', 'kcal')
    search_fields = ('name','proteina','grasa', 'kcal')

# Registrando los modelos en el sitio de administración
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(Training, TrainingAdmin)
admin.site.register(TrainingExercise)  
admin.site.register(ActivityRecord)  
admin.site.register(Challenge, ChallengeAdmin)
admin.site.register(UserChallenge)  
admin.site.register(MuscleGroup, MuscleGroupAdmin)
admin.site.register(AlimentoBase, AlimentoBaseAdmin)