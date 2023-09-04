from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import CustomUser, Exercise, Training, Challenge
from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm, CustomUserUpdateForm, ExerciseForm, TrainingForm, TrainingExerciseFormSet
from django.contrib import messages

#View para el home
def home(request):
    return render(request, 'application/base.html')

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
    template_name = 'exercise/exercise_list.html'
    
class ExerciseDetailView(DetailView):
    model = Exercise
    template_name = 'exercise/exercise_detail.html'
    
class ExerciseCreateView(CreateView):
    model = Exercise
    form_class = ExerciseForm  # Usa el formulario que has creado
    template_name = 'exercise/exercise_form.html'
    success_url = reverse_lazy('exercise_list')
    
class ExerciseUpdateView(UpdateView):
    model = Exercise
    form_class = ExerciseForm  # Usa el formulario que has creado
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
    form_class = TrainingForm  # como definido anteriormente
    template_name = 'training/training_form.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.POST:
            context['exercise_form'] = TrainingExerciseFormSet(self.request.POST, instance=self.object)
        else:
            context['exercise_form'] = TrainingExerciseFormSet(instance=self.object)
        return context

    def form_valid(self, form):
        context = self.get_context_data()
        exercise_form = context['exercise_form']
        if exercise_form.is_valid():
            self.object = form.save()
            exercise_form.instance = self.object
            exercise_form.save()
            return redirect(self.get_success_url())
        else:
            return self.render_to_response(self.get_context_data(form=form))
    
    def get_success_url(self):
        return reverse_lazy('training_list')

    
class TrainingUpdateView(UpdateView):
    model = Training
    form_class = TrainingForm  # como definido anteriormente
    template_name = 'training/training_form.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.POST:
            # Pasar la instancia de Training ya existente (self.object) al FormSet
            context['exercise_form'] = TrainingExerciseFormSet(self.request.POST, instance=self.object)
        else:
            context['exercise_form'] = TrainingExerciseFormSet(instance=self.object)
        return context

    def form_valid(self, form):
        context = self.get_context_data()
        exercise_form = context['exercise_form']
        if exercise_form.is_valid():
            self.object = form.save()
            exercise_form.instance = self.object
            exercise_form.save()
            return redirect(self.get_success_url())
        else:
            return self.render_to_response(self.get_context_data(form=form))
    
    def get_success_url(self):
        return reverse_lazy('training_list')


    
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