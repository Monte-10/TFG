from django.shortcuts import render
from django.views import generic
from django.urls import reverse_lazy
from django.contrib.auth import authenticate, login
from .forms import *


# Vistas del usuario

class SingUpView(generic.CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'signup.html'
    
    def form_valid(self, form):
        valid = super(SingUpView, self).form_valid(form)
        username = form.cleaned_data['username']
        password = form.cleaned_data['password1']
        user = authenticate(username=username, password=password)
        login(self.request, user)
        return valid