from django.contrib import admin
from .models import CustomUser, Exercise, Training, TrainingExercise, ActivityRecord, Challenge, UserChallenge, MuscleGroup

# ModelAdmin personalizado para CustomUser
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'gender', 'age',)
    search_fields = ('username', 'email',)
    # Agrega cualquier otro campo o configuración que desees

# ModelAdmin personalizado para Exercise
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('name', 'duration',)
    search_fields = ('name',)

# ModelAdmin personalizado para Training
class TrainingAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'date',)
    search_fields = ('name', 'user__username',)

# ModelAdmin personalizado para Challenge
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_date', 'end_date',)
    search_fields = ('name',)
    
class MuscleGroupAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# Registrando los modelos en el sitio de administración
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(Training, TrainingAdmin)
admin.site.register(TrainingExercise)  # Puedes personalizar esto más tarde si lo deseas
admin.site.register(ActivityRecord)  # Puedes personalizar esto más tarde si lo deseas
admin.site.register(Challenge, ChallengeAdmin)
admin.site.register(UserChallenge)  # Puedes personalizar esto más tarde si lo deseas
admin.site.register(MuscleGroup, MuscleGroupAdmin)
