from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import CustomUser, Exercise, Training, Challenge
from .models import AlimentoVariable, ComidaVariable, OpcionVariable, PlanVariable, Calendario
from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm, CustomUserUpdateForm, ExerciseForm, TrainingForm, ComidaForm, OpcionForm, PlanForm, UserProfileForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

#View para el home
def home(request):
    return render(request, 'base_generic.html')

def login(request):
    return render(request, 'application/login.html')

def inicio(request):
    context = {}
    
    if request.user.is_authenticated:
        if request.user.role == "entrenador":
            context['is_trainer'] = True
            context['has_pending_requests'] = TrainingRequest.objects.filter(trainer=request.user, status='pendiente').exists()
        else:
            context['is_trainer'] = False
            context['has_trainer'] = request.user.entrenador is not None
            if context['has_trainer']:
                context['trainer_name'] = request.user.entrenador.username
                
    return render(request, 'application/inicio.html', context)

def perfil(request):
    if not request.user.is_authenticated:
        return redirect('login')
    
    if request.user.role == 'cliente' and request.method == 'POST':
        form = UserProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Perfil actualizado con éxito.')
            return redirect('perfil')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")

    elif request.user.role == 'cliente':
        form = UserProfileForm(instance=request.user)
    else:
        form = None
        
    return render(request, 'application/perfil.html', {'user': request.user, 'form': form})
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

from django.contrib.auth import authenticate, login
class CustomUserCreateView(CreateView):
    model = CustomUser
    form_class = CustomUserCreationForm  # Usar form_class en lugar de fields
    template_name = 'customuser/customuser_form.html'
    success_url = reverse_lazy('inicio')
    
    def form_valid(self, form):
        # Este método se llama cuando el formulario es válido y se va a guardar
        response = super().form_valid(form)
        user = authenticate(username=self.object.username, password=form.cleaned_data['password1'])
        if user:
            login(self.request, user)
        return response


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
    model = AlimentoVariable
    fields = '__all__' 
    template_name = 'alimentacion/alimento/alimento_form.html'
    success_url = reverse_lazy('alimento_list')
    
class AlimentoListView(ListView):
    model = AlimentoVariable
    template_name = 'alimentacion/alimento/alimento_list.html'
    
class AlimentoDetailView(DetailView):
    model = AlimentoVariable
    template_name = 'alimentacion/alimento/alimento_detail.html'
    
class AlimentoUpdateView(UpdateView):
    model = AlimentoVariable
    fields = '__all__'
    template_name = 'alimentacion/alimento/alimento_form.html'
    success_url = reverse_lazy('alimento_list')
    
class AlimentoDeleteView(DeleteView):
    model = AlimentoVariable
    template_name = 'alimentacion/alimento/alimento_confirm_delete.html'
    success_url = reverse_lazy('alimento_list')
    
class ComidaCreateView(CreateView):
    model = ComidaVariable
    form_class = ComidaForm
    template_name = 'alimentacion/comida/comida_form.html'
    success_url = reverse_lazy('comida_list')
    
class ComidaListView(ListView):
    model = ComidaVariable
    template_name = 'alimentacion/comida/comida_list.html'
    
class ComidaDetailView(DetailView):
    model = ComidaVariable
    template_name = 'alimentacion/comida/comida_detail.html'
    
class ComidaUpdateView(UpdateView):
    model = ComidaVariable
    form_class = ComidaForm
    template_name = 'alimentacion/comida/comida_form.html'
    success_url = reverse_lazy('comida_list')
    
class ComidaDeleteView(DeleteView):
    model = ComidaVariable
    template_name = 'alimentacion/comida/comida_confirm_delete.html'
    success_url = reverse_lazy('comida_list')
    
class OpcionCreateView(CreateView):
    model = OpcionVariable
    form_class = OpcionForm
    template_name = 'alimentacion/opcion/opcion_form.html'
    success_url = reverse_lazy('opcion_list')
    
class OpcionListView(ListView):
    model = OpcionVariable
    template_name = 'alimentacion/opcion/opcion_list.html'
    
class OpcionDetailView(DetailView):
    model = OpcionVariable
    template_name = 'alimentacion/opcion/opcion_detail.html'
    
class OpcionUpdateView(UpdateView):
    model = OpcionVariable
    form_class = OpcionForm
    template_name = 'alimentacion/opcion/opcion_form.html'
    success_url = reverse_lazy('opcion_list')
    
class OpcionDeleteView(DeleteView):
    model = OpcionVariable
    template_name = 'alimentacion/opcion/opcion_confirm_delete.html'
    success_url = reverse_lazy('opcion_list')

class PlanCreateView(CreateView):
    model = PlanVariable
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
    model = PlanVariable
    template_name = 'alimentacion/plan/plan_list.html'
    
class PlanDetailView(DetailView):
    model = PlanVariable
    template_name = 'alimentacion/plan/plan_detail.html'
    
class PlanUpdateView(UpdateView):
    model = PlanVariable
    form_class = PlanForm
    template_name = 'alimentacion/plan/plan_form.html'
    success_url = reverse_lazy('plan_list')

class PlanDeleteView(DeleteView):
    model = PlanVariable
    template_name = 'alimentacion/plan/plan_confirm_delete.html'
    success_url = reverse_lazy('plan_list')

from django.shortcuts import get_object_or_404
from datetime import timedelta
from django.forms import modelformset_factory
from .forms import CalendarioFechaOpcionForm
from django.http import HttpResponseForbidden

def crear_calendario(request, plan_id):
    plan = get_object_or_404(PlanVariable, id=plan_id)
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
        events = []
        if request.user.is_authenticated and request.user.role == "cliente":
            calendarios = Calendario.objects.filter(cliente=request.user)
            for calendario in calendarios:
                event = {
                    "title": calendario.opcion.name,
                    "start": calendario.fecha.strftime('%Y-%m-%d')
                }
                events.append(event)
            return render(request, 'alimentacion/alimentacion_cliente.html', {"events": events})
        else:
            return redirect('login')


@login_required
def view_assigned_clients(request):
    if request.user.role == 'entrenador':
        assigned_clients = CustomUser.objects.filter(entrenador=request.user)
        return render(request, 'customuser/trainer_assigned_clients.html', {'clients': assigned_clients})
    else:
        return redirect('home')  # Redirect to home if user is not a trainer

from .models import TrainingRequest

@login_required
def request_trainer_view(request):
    # Asegurarse de que el usuario esté autenticado y sea un cliente
    if not request.user.is_authenticated or request.user.role != 'cliente':
        return redirect('login')  # O redirige a donde prefieras

    trainers = CustomUser.objects.filter(role='entrenador')
    if request.method == 'POST':
        trainer_id = request.POST.get('trainer_id')
        trainer = CustomUser.objects.get(id=trainer_id)
        TrainingRequest.objects.create(client=request.user, trainer=trainer)
        return redirect('home')  # Redirige a la vista que prefieras después de enviar la solicitud

    return render(request, 'customuser/request_trainer.html', {'trainers': trainers})

@login_required
def view_requests_view(request):
    
    if not request.user.is_authenticated or request.user.role != 'entrenador':
        return redirect('login')

    requests = TrainingRequest.objects.filter(trainer=request.user, status='pendiente')
    return render(request, 'customuser/view_requests.html', {'requests': requests})


def accept_request(request, request_id):
    try:
        training_request = TrainingRequest.objects.get(id=request_id)
        training_request.status = 'aceptada'
        training_request.client.entrenador = training_request.trainer
        training_request.client.save()
        training_request.save()
    except TrainingRequest.DoesNotExist:
        pass
    return redirect('view_requests')

def reject_request(request, request_id):
    try:
        training_request = TrainingRequest.objects.get(id=request_id)
        training_request.status = 'rechazada'
        training_request.save()
    except TrainingRequest.DoesNotExist:
        pass
    return redirect('view_requests')


from django.shortcuts import render, redirect
from .models import AlimentoBase
from .forms import AlimentoForm

def list_alimento_base(request):
    alimentos = AlimentoBase.objects.all()
    return render(request, 'alimentacion/alimento/list_alimento_base.html', {'alimentos': alimentos})

def add_edit_alimento_base(request, alimento_id=None):
    if alimento_id:
        alimento = AlimentoBase.objects.get(id=alimento_id)
    else:
        alimento = None

    if request.method == 'POST':
        form = AlimentoForm(request.POST, instance=alimento)
        if form.is_valid():
            form.save()
            return redirect('list_alimento_base')
    else:
        form = AlimentoForm(instance=alimento)

    return render(request, 'alimentacion/alimento/add_edit_alimento_base.html', {'form': form})

# The view to add an alimento to a comida will be defined later after understanding the 'comida' model and its relations

def add_alimento_to_comida(request):
    if request.method == 'POST':
        form = ComidaForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('comida_list')  # Assuming there's a view named 'comida_list'
    else:
        form = ComidaForm()

    return render(request, 'alimentacion/comida/comida_form.html', {'form': form})

class AlimentoBaseDeleteView(DeleteView):
    model = AlimentoBase
    template_name = 'alimentacion/alimento/alimento_base_confirm_delete.html'
    success_url = reverse_lazy('list_alimento_base')

from .models import PlatoBase, PlatoVariable
from .forms import PlatoForm, PlatoBaseForm, AlimentoVariableFormSet

def list_plato_base(request):
    platos = PlatoBase.objects.all()
    return render(request, 'alimentacion/plato/list_plato_base.html', {'platos': platos})

def add_edit_plato_base(request, plato_id=None):
    if plato_id:
        plato_base = get_object_or_404(PlatoBase, id=plato_id)
        plato_form = PlatoBaseForm(instance=plato_base)
        formset = AlimentoVariableFormSet(instance=plato_base)
    else:
        plato_form = PlatoBaseForm()
        formset = AlimentoVariableFormSet()

    if request.method == 'POST':
        plato_form = PlatoBaseForm(request.POST, instance=plato_base if plato_id else None)
        formset = AlimentoVariableFormSet(request.POST, instance=plato_base if plato_id else None)

        if plato_form.is_valid() and formset.is_valid():
            created_plato = plato_form.save()
            formset.instance = created_plato
            formset.save()
            return redirect('list_plato_base')

    context = {
        'plato_form': plato_form,
        'formset': formset,
    }
    return render(request, 'alimentacion/plato/add_edit_plato_base.html', context)

class PlatoCreateView(CreateView):
    model = PlatoVariable
    form_class = PlatoForm
    template_name = 'alimentacion/plato/plato_form.html'
    success_url = reverse_lazy('plato_list')
    
class PlatoListView(ListView):
    model = PlatoVariable
    template_name = 'alimentacion/plato/plato_list.html'
    
class PlatoDetailView(DetailView):
    model = PlatoVariable
    template_name = 'alimentacion/plato/plato_detail.html'
    
class PlatoUpdateView(UpdateView):
    model = PlatoVariable
    form_class = PlatoForm
    template_name = 'alimentacion/plato/plato_form.html'
    success_url = reverse_lazy('plato_list')
    
class PlatoDeleteView(DeleteView):
    model = PlatoVariable
    template_name = 'alimentacion/plato/plato_confirm_delete.html'
    success_url = reverse_lazy('plato_list')
    
class PlatoBaseDeleteView(DeleteView):
    model = PlatoBase
    template_name = 'alimentacion/plato/plato_base_confirm_delete.html'
    success_url = reverse_lazy('list_plato_base')

from .models import ComidaBase
from .forms import ComidaForm
    
def list_comida_base(request):
    comidas = ComidaBase.objects.all()
    return render(request, 'alimentacion/comida/list_comida_base.html', {'comidas': comidas})

def add_edit_comida_base(request, comida_id=None):
    if comida_id:
        comida = ComidaBase.objects.get(id=comida_id)
    else:
        comida = None

    if request.method == 'POST':
        form = ComidaForm(request.POST, instance=comida)
        if form.is_valid():
            form.save()
            return redirect('list_comida_base')
    else:
        form = ComidaForm(instance=comida)

    return render(request, 'alimentacion/comida/add_edit_comida_base.html', {'form': form})

class ComidaBaseDeleteView(DeleteView):
    model = ComidaBase
    template_name = 'alimentacion/comida/comida_base_confirm_delete.html'
    success_url = reverse_lazy('list_comida_base')
