from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import CustomUser, Exercise, Training, Challenge
from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm
from django.contrib import messages

# Vistas para CustomUser

def register_customuser(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            # Mensaje de éxito:
            messages.success(request, 'Registro completado con éxito. Ahora puedes iniciar sesión.')
            # Redirige al usuario a la página de inicio (home.html) después del registro exitoso.
            return redirect('home')  # Asumiendo que 'home' es el nombre de la URL para home.html.
        else:
            # Si el formulario es inválido, vuelve a mostrar el formulario con los errores.
            messages.error(request, 'Por favor, corrige los errores.')
    else:
        form = CustomUserCreationForm()

    return render(request, 'customuser/customuser_form.html', {'form': form})



class CustomUserListView(ListView):
    model = CustomUser
    template_name = 'customuser/customuser_list.html'

class CustomUserDetailView(DetailView):
    model = CustomUser
    template_name = 'customuser/customuser_detail.html'

class CustomUserCreateView(CreateView):
    model = CustomUser
    fields = ['username', 'password', 'email', 'first_name', 'last_name', 'email', 'gender', 'weight', 'height', 'age', 'waist_measurement', 'hip_measurement', 'goal', 'health_issues', 'blood_pressure', 'blood_sugar', 'daily_water_intake', 'diet_type', 'calorie_intake', 'lifestyle', 'other_goals']  # Agrega todos los campos que necesites aquí
    template_name = 'customuser/customuser_form.html'
    success_url = reverse_lazy('customuser_list')

class CustomUserUpdateView(UpdateView):
    model = CustomUser
    fields = ['username', 'password', 'email', 'first_name', 'last_name', 'email', 'gender', 'weight', 'height', 'age', 'waist_measurement', 'hip_measurement', 'goal', 'health_issues', 'blood_pressure', 'blood_sugar', 'daily_water_intake', 'diet_type', 'calorie_intake', 'lifestyle', 'other_goals']  # Agrega todos los campos que necesites aquí
    template_name = 'customuser/customuser_form.html'
    success_url = reverse_lazy('customuser_list')

class CustomUserDeleteView(DeleteView):
    model = CustomUser
    template_name = 'customuser/customuser_confirm_delete.html'
    success_url = reverse_lazy('customuser_list')

# Vistas para Exercise
class ExerciseListView(ListView):
    model = Exercise
    template_name = 'exercise/exercise_list.html'
    
class ExerciseDetailView(DetailView):
    model = Exercise
    template_name = 'exercise/exercise_detail.html'
    
class ExerciseCreateView(CreateView):
    model = Exercise
    fields = ['name', 'video_url', 'description', 'muscle_groups', 'muscle_image', 'duration', 'timer',]  # Agrega todos los campos que necesites aquí
    template_name = 'exercise/exercise_form.html'
    success_url = reverse_lazy('exercise_list')
    
class ExerciseUpdateView(UpdateView):
    model = Exercise
    fields = ['name', 'video_url', 'description', 'muscle_groups', 'muscle_image', 'duration', 'timer',]  # Agrega todos los campos que necesites aquí
    template_name = 'exercise/exercise_form.html'
    success_url = reverse_lazy('exercise_list')
    
class ExerciseDeleteView(DeleteView):
    model = Exercise
    template_name = 'exercise/exercise_confirm_delete.html'
    success_url = reverse_lazy('exercise_list')
    
# Vistas para Training
class TrainingListView(ListView):
    model = Training
    template_name = 'training/training_list.html'
    
class TrainingDetailView(DetailView):
    model = Training
    template_name = 'training/training_detail.html'
    
class TrainingCreateView(CreateView):
    model = Training
    fields = ['user', 'name', 'description', 'approximate_duration', 'muscle_groups', 'note', 'date', 'exercises']
    template_name = 'training/training_form.html'
    success_url = reverse_lazy('training_list')
    
class TrainingUpdateView(UpdateView):
    model = Training
    fields = ['user', 'name', 'description', 'approximate_duration', 'muscle_groups', 'note', 'date', 'exercises']
    template_name = 'training/training_form.html'
    success_url = reverse_lazy('training_list')
    
class TrainingDeleteView(DeleteView):
    model = Training
    template_name = 'training/training_confirm_delete.html'
    success_url = reverse_lazy('training_list')

# Vistas para Challenge
class ChallengeListView(ListView):
    model = Challenge
    template_name = 'challenge/challenge_list.html'
    
class ChallengeDetailView(DetailView):
    model = Challenge
    template_name = 'challenge/challenge_detail.html'
    
class ChallengeCreateView(CreateView):
    model = Challenge
    fields = '__all__' 
    template_name = 'challenge/challenge_form.html'
    success_url = reverse_lazy('challenge_list')
    
class ChallengeUpdateView(UpdateView):
    model = Challenge
    fields = '__all__'
    template_name = 'challenge/challenge_form.html'
    success_url = reverse_lazy('challenge_list')
    
class ChallengeDeleteView(DeleteView):
    model = Challenge
    template_name = 'challenge/challenge_confirm_delete.html'
    success_url = reverse_lazy('challenge_list')