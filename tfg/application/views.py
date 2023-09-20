from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import CustomUser, Exercise, Training, Challenge
from .models import Alimento, Comida, Opcion, Plan, Calendario
from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm, CustomUserUpdateForm, ExerciseForm, TrainingForm, ComidaForm, OpcionForm, PlanForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

#View para el home
def home(request):
    return render(request, 'base_generic.html')

def login(request):
    return render(request, 'application/login.html')

def inicio(request):
    calendario_list = []
    
    if request.user.is_authenticated and request.user.role == "cliente":
        calendario_entries = Calendario.objects.filter(cliente=request.user).order_by('fecha')
        calendario_list = [(entry.fecha, entry.opcion) for entry in calendario_entries]
        
    return render(request, 'application/inicio_cliente.html', {'calendario': calendario_list})

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
    
class OpcionCreateView(CreateView):
    model = Opcion
    form_class = OpcionForm
    template_name = 'alimentacion/opcion/opcion_form.html'
    success_url = reverse_lazy('opcion_list')
    
class OpcionListView(ListView):
    model = Opcion
    template_name = 'alimentacion/opcion/opcion_list.html'
    
class OpcionDetailView(DetailView):
    model = Opcion
    template_name = 'alimentacion/opcion/opcion_detail.html'
    
class OpcionUpdateView(UpdateView):
    model = Opcion
    form_class = OpcionForm
    template_name = 'alimentacion/opcion/opcion_form.html'
    success_url = reverse_lazy('opcion_list')
    
class OpcionDeleteView(DeleteView):
    model = Opcion
    template_name = 'alimentacion/opcion/opcion_confirm_delete.html'
    success_url = reverse_lazy('opcion_list')

class PlanCreateView(CreateView):
    model = Plan
    form_class = PlanForm
    template_name = 'alimentacion/plan/plan_form.html'
    success_url = reverse_lazy('plan_list')

    def form_valid(self, form):
        # Obten el objeto Plan creado
        self.object = form.save()
        # Redirige al usuario a la página de creación de Calendario, pasando el ID del Plan recién creado en la URL
        return redirect('calendario_create', plan_id=self.object.id)
        #return redirect('plan_list')

    
class PlanListView(ListView):
    model = Plan
    template_name = 'alimentacion/plan/plan_list.html'
    
class PlanDetailView(DetailView):
    model = Plan
    template_name = 'alimentacion/plan/plan_detail.html'
    
class PlanUpdateView(UpdateView):
    model = Plan
    form_class = PlanForm
    template_name = 'alimentacion/plan/plan_form.html'
    success_url = reverse_lazy('plan_list')

class PlanDeleteView(DeleteView):
    model = Plan
    template_name = 'alimentacion/plan/plan_confirm_delete.html'
    success_url = reverse_lazy('plan_list')

from django.shortcuts import get_object_or_404
from datetime import timedelta
from django.forms import modelformset_factory
from .forms import CalendarioFechaOpcionForm
from django.http import HttpResponseForbidden

def crear_calendario(request, plan_id):
    plan = get_object_or_404(Plan, id=plan_id)
    cliente = plan.cliente

    # Obtener todas las fechas entre start_date y end_date del plan, incluyendo end_date
    fechas_plan = [plan.start_date + timedelta(days=i) for i in range((plan.end_date - plan.start_date).days + 1)]

    CalendarioFechaOpcionFormSet = modelformset_factory(Calendario, form=CalendarioFechaOpcionForm, extra=len(fechas_plan))

    if request.method == 'POST':
        formset = CalendarioFechaOpcionFormSet(request.POST, queryset=Calendario.objects.none(), prefix='calendario_formset', form_kwargs={'plan': plan})
        
        # Establecer manualmente el plan y el cliente para cada instancia y verificar la validez del formulario
        all_forms_valid = True
        for form in formset:
            form.instance.plan = plan
            form.instance.cliente = cliente  # Asignamos el cliente aquí
            if not form.is_valid():
                all_forms_valid = False
                
        if all_forms_valid:
            formset.save()
            return redirect('home')  # Redirigir a donde desees después de guardar los calendarios

    else:
        initial_data = [{'fecha': fecha} for fecha in fechas_plan]
        formset = CalendarioFechaOpcionFormSet(queryset=Calendario.objects.none(), prefix='calendario_formset', initial=initial_data, form_kwargs={'plan': plan})

    return render(request, 'alimentacion/calendario/calendario_form.html', {'formset': formset})

from django.http import JsonResponse

@login_required
def calendario_data(request):
    cliente_id = request.user.id
    # Assuming cliente_id is the ID of the logged-in cliente or can be obtained some other way
    calendarios = Calendario.objects.filter(cliente_id=cliente_id)
    
    events = [
        {
            'title': calendario.opcion.name,
            'start': calendario.fecha.strftime('%Y-%m-%d'),
        }
        for calendario in calendarios
    ]
    
    return JsonResponse(events, safe=False)

from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def alimentacion(request):
    if request.user.is_authenticated and request.user.role == "entrenador":
        return render(request, 'alimentacion/alimentacion_entrenador.html')
    else:
        return render(request, 'alimentacion/alimentacion_cliente.html')
