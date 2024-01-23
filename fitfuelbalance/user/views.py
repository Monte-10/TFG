from django.shortcuts import render, redirect
from django.views import generic
from django.urls import reverse_lazy
from django.contrib.auth import authenticate, login
from django.core.exceptions import ObjectDoesNotExist
from .forms import *

from .models import Profile, RegularUser

# Vistas del usuario

class RegularUserSingUpView(generic.CreateView):
    form_class = RegularUserCreationForm
    success_url = reverse_lazy('profile')
    template_name = 'regularsignup.html'
    
    def form_valid(self, form):
        valid = super(RegularUserSingUpView, self).form_valid(form)
        username = form.cleaned_data['username']
        password = form.cleaned_data['password1']
        user = authenticate(username=username, password=password)
        login(self.request, user)
        return valid
    
class TrainerSingUpView(generic.CreateView):
    form_class = TrainerCreationForm
    success_url = reverse_lazy('profile')
    template_name = 'trainersignup.html'
    
    def form_valid(self, form):
        valid = super(TrainerSingUpView, self).form_valid(form)
        username = form.cleaned_data['username']
        password = form.cleaned_data['password1']
        user = authenticate(username=username, password=password)
        login(self.request, user)
        return valid

class ProfileView(generic.TemplateView):
    template_name = 'profile.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        context['profile'], _ = Profile.objects.get_or_create(user=user)

        # Verificar si el usuario es un RegularUser
        if hasattr(user, 'regularuser'):
            regular_user_form = RegularUserInfoForm(instance=user.regularuser)  # Usa RegularUserInfoForm
            context['user_form'] = regular_user_form
        # Verificar si el usuario es un Trainer
        elif hasattr(user, 'trainer'):
            trainer_form = TrainerInfoForm(instance=user.trainer)
            context['user_form'] = trainer_form
        else:
            context['user_form'] = None

        context['profile_form'] = ProfileForm(instance=context['profile'])
        return context

    def post(self, request, *args, **kwargs):
        user = request.user
        profile, _ = Profile.objects.get_or_create(user=user)
        profile_form = ProfileForm(request.POST, instance=profile)
        user_form = None

        if hasattr(user, 'regularuser'):
            user_form = RegularUserInfoForm(request.POST, instance=user.regularuser)
        elif hasattr(user, 'trainer'):
            user_form = TrainerInfoForm(request.POST, instance=user.trainer)

        if profile_form.is_valid() and (user_form is None or user_form.is_valid()):
            profile_form.save()
            if user_form:
                user_form_instance = user_form.save(commit=False)
                user_form_instance.user = user  # Asegura la relación con el usuario
                user_form_instance.save()
                if hasattr(user_form, 'save_m2m'):
                    user_form.save_m2m()  # Para campos ManyToMany
            return redirect('profile')

        # Agregar manejo de errores aquí si es necesario

        return self.render_to_response(self.get_context_data(
            profile_form=profile_form, 
            user_form=user_form
        ))
