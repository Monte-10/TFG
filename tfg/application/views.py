from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import CustomUser, Exercise, Training, Challenge
from .models import Alimento, Comida
''', DiaDieta, Dieta'''
from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm, CustomUserUpdateForm, ExerciseForm, TrainingForm, ComidaForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

#View para el home
def home(request):
    return render(request, 'application/base.html')

def login(request):
    return render(request, 'application/login.html')

# Vistas para CustomUser

def register_customuser(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            # Mensaje de éxito:
            messages.success(request, 'Registro completado con éxito. Ahora puedes iniciar sesión.')
            # Redirige al usuario a la página de inicio (home.html) después del registro exitoso.
            return redirect('customuser_list')  # Asumiendo que 'home' es el nombre de la URL para home.html.
        else:
            # Si el formulario es inválido, vuelve a mostrar el formulario con los errores.
            messages.error(request, 'Por favor, corrige los errores.')
            print(form.errors)
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
    form_class = CustomUserCreationForm  # Usar form_class en lugar de fields
    template_name = 'customuser/customuser_form.html'
    success_url = reverse_lazy('customuser_list')


class CustomUserUpdateView(UpdateView):
    model = CustomUser
    form_class = CustomUserUpdateForm  # Usar form_class en lugar de fields
    template_name = 'customuser/customuser_form.html'
    success_url = reverse_lazy('customuser_list')

class CustomUserDeleteView(DeleteView):
    model = CustomUser
    template_name = 'customuser/customuser_confirm_delete.html'
    success_url = reverse_lazy('customuser_list')

# Vistas para Exercise
class ExerciseListView(ListView):
    model = Exercise
    template_name = 'deporte/exercise/exercise_list.html'
    
class ExerciseDetailView(DetailView):
    model = Exercise
    template_name = 'deporte/exercise/exercise_detail.html'
    
class ExerciseCreateView(CreateView):
    model = Exercise
    form_class = ExerciseForm  
    template_name = 'deporte/exercise/exercise_form.html'
    success_url = reverse_lazy('exercise_list')
    
class ExerciseUpdateView(UpdateView):
    model = Exercise
    form_class = ExerciseForm  
    template_name = 'deporte/exercise/exercise_form.html'
    success_url = reverse_lazy('exercise_list')
    
class ExerciseDeleteView(DeleteView):
    model = Exercise
    template_name = 'deporte/exercise/exercise_confirm_delete.html'
    success_url = reverse_lazy('exercise_list')
    
# Vistas para Training
class TrainingListView(ListView):
    model = Training
    template_name = 'deporte/training/training_list.html'
    
class TrainingDetailView(DetailView):
    model = Training
    template_name = 'deporte/training/training_detail.html'
    
class TrainingCreateView(CreateView):
    model = Training
    form_class = TrainingForm  
    template_name = 'deporte/training/training_form.html'
    success_url = reverse_lazy('training_list')

class TrainingUpdateView(UpdateView):
    model = Training
    form_class = TrainingForm  
    template_name = 'deporte/training/training_form.html'
    success_url = reverse_lazy('training_list')
    
class TrainingDeleteView(DeleteView):
    model = Training
    template_name = 'deporte/training/training_confirm_delete.html'
    success_url = reverse_lazy('training_list')

# Vistas para Challenge
class ChallengeListView(ListView):
    model = Challenge
    template_name = 'deporte/challenge/challenge_list.html'
    
class ChallengeDetailView(DetailView):
    model = Challenge
    template_name = 'deporte/challenge/challenge_detail.html'
    
class ChallengeCreateView(CreateView):
    model = Challenge
    fields = '__all__' 
    template_name = 'deporte/challenge/challenge_form.html'
    success_url = reverse_lazy('challenge_list')
    
class ChallengeUpdateView(UpdateView):
    model = Challenge
    fields = '__all__'
    template_name = 'deporte/challenge/challenge_form.html'
    success_url = reverse_lazy('challenge_list')
    
class ChallengeDeleteView(DeleteView):
    model = Challenge
    template_name = 'deporte/challenge/challenge_confirm_delete.html'
    success_url = reverse_lazy('challenge_list')
    
@method_decorator(login_required, name='dispatch')
class ClientTrainingsListView(ListView):
    model = Training
    template_name = 'deporte/training/my_trainings_list.html'
    context_object_name = 'trainings'
    
    def get_queryset(self):
        # Filtrar los entrenamientos para el usuario actual y ordenar por fecha
        return Training.objects.filter(cliente=self.request.user).order_by('-date')
    
class AlimentoCreateView(CreateView):
    model = Alimento
    fields = '__all__' 
    template_name = 'alimentacion/alimento/alimento_form.html'
    success_url = reverse_lazy('alimento_list')
    
class AlimentoListView(ListView):
    model = Alimento
    template_name = 'alimentacion/alimento/alimento_list.html'
    
class AlimentoDetailView(DetailView):
    model = Alimento
    template_name = 'alimentacion/alimento/alimento_detail.html'
    
class AlimentoUpdateView(UpdateView):
    model = Alimento
    fields = '__all__'
    template_name = 'alimentacion/alimento/alimento_form.html'
    success_url = reverse_lazy('alimento_list')
    
class AlimentoDeleteView(DeleteView):
    model = Alimento
    template_name = 'alimentacion/alimento/alimento_confirm_delete.html'
    success_url = reverse_lazy('alimento_list')
    
class ComidaCreateView(CreateView):
    model = Comida
    form_class = ComidaForm
    template_name = 'alimentacion/comida/comida_form.html'
    success_url = reverse_lazy('comida_list')
    
class ComidaListView(ListView):
    model = Comida
    template_name = 'alimentacion/comida/comida_list.html'
    
class ComidaDetailView(DetailView):
    model = Comida
    template_name = 'alimentacion/comida/comida_detail.html'
    
class ComidaUpdateView(UpdateView):
    model = Comida
    form_class = ComidaForm
    template_name = 'alimentacion/comida/comida_form.html'
    success_url = reverse_lazy('comida_list')
    
class ComidaDeleteView(DeleteView):
    model = Comida
    template_name = 'alimentacion/comida/comida_confirm_delete.html'
    success_url = reverse_lazy('comida_list')