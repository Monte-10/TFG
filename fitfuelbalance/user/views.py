from django.shortcuts import render, redirect, get_object_or_404
from django.views import generic
from django.views.generic import TemplateView
from django.urls import reverse_lazy
from django.contrib.auth import authenticate, login
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseBadRequest
from .forms import *
from .models import *
from .serializers import *
from rest_framework import viewsets
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from sport.models import Training
from sport.serializers import TrainingSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
# Vistas del usuario

class RegularUserSignUpView(generic.CreateView):
    form_class = RegularUserCreationForm
    success_url = reverse_lazy('profile')
    template_name = 'regularsignup.html'
    
    def form_valid(self, form):
        valid = super(RegularUserSignUpView, self).form_valid(form)
        username = form.cleaned_data['username']
        password = form.cleaned_data['password1']
        user = authenticate(username=username, password=password)
        login(self.request, user)
        return valid
    
class TrainerSignUpView(generic.CreateView):
    form_class = TrainerCreationForm
    success_url = reverse_lazy('profile')
    template_name = 'trainersignup.html'
    
    def form_valid(self, form):
        valid = super(TrainerSignUpView, self).form_valid(form)
        username = form.cleaned_data['username']
        password = form.cleaned_data['password1']
        user = authenticate(username=username, password=password)
        login(self.request, user)
        return valid

"""
class ProfileView(TemplateView):
    template_name = 'profile.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        context['profile'], _ = Profile.objects.get_or_create(user=user)

        # Verificar si el usuario es un RegularUser
        if user.is_regular_user():
            regular_user = user.regularuser
            context['user_form'] = RegularUserInfoForm(instance=regular_user)
            context['personal_trainer'] = regular_user.personal_trainer
        # Verificar si el usuario es un Trainer
        elif user.is_trainer():
            trainer = user.trainer
            context['user_form'] = TrainerInfoForm(instance=trainer)
            context['clients'] = trainer.clients.all()

        context['profile_form'] = ProfileForm(instance=context['profile'])
        return context

    def post(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        profile_form = ProfileForm(request.POST, instance=context['profile'])
        if profile_form.is_valid():
            profile_form.save()

        user_form = None
        if request.user.is_regular_user():
            user_form = RegularUserInfoForm(request.POST, instance=request.user.regularuser)
        elif request.user.is_trainer():
            user_form = TrainerInfoForm(request.POST, instance=request.user.trainer)

        if user_form and user_form.is_valid():
            user_form_instance = user_form.save(commit=False)
            user_form_instance.user = request.user  # Asegura la relación con el usuario
            user_form_instance.save()
            if hasattr(user_form, 'save_m2m'):
                user_form.save_m2m()  # Para campos ManyToMany

        return redirect('profile')
"""
from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        user = request.user
        if hasattr(user, 'trainer'):
            serializer = TrainerSerializer(user.trainer)
        else:
            serializer = ProfileSerializer(user.profile)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        if hasattr(user, 'trainer'):
            serializer = TrainerSerializer(user.trainer, data=request.data, partial=True)
        else:
            serializer = ProfileSerializer(user.profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class SpecialtyListView(generics.ListAPIView):
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer
"""
@login_required  # Asegura que el usuario esté autenticado
def search_trainer(request):
    if not request.user.is_regular_user():
        return HttpResponseBadRequest("Solo los usuarios regulares pueden enviar solicitudes.")
    
    # Si el usuario ya tiene un entrenador, no puede enviar más solicitudes
    regularUser = RegularUser.objects.filter(id=request.user.id).first()
    if regularUser.has_personal_trainer():
        return HttpResponseBadRequest("Ya tienes un entrenador.")
    
    form = TrainerSearchForm(request.GET or None)
    trainers = Trainer.objects.all()

    if form.is_valid():
        if form.cleaned_data['specialty']:
            trainers = trainers.filter(specialties__in=form.cleaned_data['specialty']).distinct()
        if form.cleaned_data['trainer_type']:
            trainers = trainers.filter(trainer_type=form.cleaned_data['trainer_type']).distinct()

    return render(request, 'search_trainer.html', {'form': form, 'trainers': trainers})

@login_required  # Asegura que el usuario esté autenticado
def send_request(request, trainer_id):
    # Verifica que el request.user sea una instancia de RegularUser
    if not request.user.is_regular_user():
        return HttpResponseBadRequest("Solo los usuarios regulares pueden enviar solicitudes.")

    trainer = get_object_or_404(Trainer, pk=trainer_id)
    regular_user = RegularUser.objects.filter(id=request.user.id).first()
    # Crea la TrainingRequest solo si el usuario es un RegularUser
    TrainingRequest.objects.create(regular_user=regular_user, trainer=trainer)
    
    return redirect('profile')
"""
from django.http import JsonResponse

@login_required
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_trainers(request):
    if not request.user.is_regular_user:
        return HttpResponseBadRequest("Solo los usuarios regulares pueden enviar solicitudes.")
    
    trainers = Trainer.objects.all()
    serializer = TrainerSerializer(trainers, many=True)
    return Response(serializer.data)

@login_required
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_trainer(request):
    if not request.user.is_regular_user:
        return HttpResponseBadRequest("Solo los usuarios regulares pueden enviar solicitudes.")
    
    specialty = request.GET.get('specialty', None)
    trainer_type = request.GET.get('trainer_type', None)
    
    trainers = Trainer.objects.all()
    
    if specialty:
        trainers = trainers.filter(specialties__name__icontains=specialty)
    if trainer_type:
        trainers = trainers.filter(trainer_type__icontains=trainer_type)
    
    serializer = TrainerSerializer(trainers, many=True)
    return JsonResponse(serializer.data, safe=False)

@login_required
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_request(request):
    if not request.user.is_regular_user:
        return HttpResponseBadRequest("Solo los usuarios regulares pueden enviar solicitudes.")
    
    trainer_id = request.data.get('trainerId')
    trainer = get_object_or_404(Trainer, id=trainer_id)
    regular_user = RegularUser.objects.get(id=request.user.id)
    
    if regular_user.has_personal_trainer():
        return HttpResponseBadRequest("Ya tienes un entrenador.")
    
    TrainingRequest.objects.create(regular_user=regular_user, trainer=trainer)
    return Response({"message": "Solicitud enviada con éxito"}, status=status.HTTP_201_CREATED)

@login_required
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def trainer_clients(request):
    trainer = get_object_or_404(Trainer, id=request.user.id)
    clients = trainer.clients.all()
    serializer = RegularUserSerializer(clients, many=True)
    return Response(serializer.data)


@login_required
def requests(request):
    # Obtener el entrenador autenticado
    trainer = Trainer.objects.get(id=request.user.id)

    # Obtener todas las solicitudes relacionadas con este entrenador
    requests = TrainingRequest.objects.filter(trainer=trainer)

    context = {
        'requests': requests
    }

    return render(request, 'requests.html', context)

def accept_request(request, request_id):
    training_request = TrainingRequest.objects.get(pk=request_id)
    if training_request:
        # Comprueba si el RegularUser ya tiene un entrenador
        if TrainingRequest.objects.filter(regular_user=training_request.regular_user, is_accepted=True).exists():
            # Manejar el caso donde el usuario ya tiene un entrenador
            pass
        else:
            training_request.is_accepted = True
            training_request.save()
            trainer = training_request.trainer
            regular_user = training_request.regular_user
            trainer.clients.add(regular_user)
            trainer.save()
            regular_user.personal_trainer = trainer
            regular_user.save()
            # Opcional: cancelar otras solicitudes
    return redirect('profile')


def reject_request(request, request_id):
    training_request = get_object_or_404(TrainingRequest, id=request_id, trainer=request.user)
    training_request.delete()
    # Redireccionar a la página donde el entrenador ve todas las solicitudes
    return redirect('requests_page')

def cancel_request(request, request_id):
    training_request = get_object_or_404(TrainingRequest, id=request_id, regular_user=request.user)
    training_request.delete()
    # Redireccionar a la página donde el usuario puede ver o enviar nuevas solicitudes
    return redirect('search_trainer')

class RegularUserViewSet(viewsets.ModelViewSet):
    queryset = RegularUser.objects.all()
    serializer_class = RegularUserSerializer
    
class TrainerViewSet(viewsets.ModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def clients(self, request, pk=None):
        trainer = self.get_object()
        clients = trainer.clients.all()
        serializer = CustomUserSerializer(clients, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def by_client(self, request):
        client_id = request.query_params.get('client_id')
        trainings = Training.objects.filter(user_id=client_id)
        serializer = TrainingSerializer(trainings, many=True)
        return Response(serializer.data)
    
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class LoginView(APIView):
    authentication_classes = []  # No authentication required
    permission_classes = []  # No permission required

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'userId': user.id}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class RegularUserSignUpAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = RegularUserSignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            login(request, user)  # Inicia sesión al usuario
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TrainerSignUpAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = TrainerSignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            login(request, user)  # Inicia sesión al usuario
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)