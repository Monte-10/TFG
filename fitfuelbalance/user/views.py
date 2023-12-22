from django.shortcuts import render
from django.views import generic
from django.urls import reverse_lazy
from django.contrib.auth import authenticate, login
from .forms import *


# Vistas del usuario

class SingUpView(generic.CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('profile')
    template_name = 'signup.html'
    
    def form_valid(self, form):
        valid = super(SingUpView, self).form_valid(form)
        username = form.cleaned_data['username']
        password = form.cleaned_data['password1']
        user = authenticate(username=username, password=password)
        login(self.request, user)
        return valid
    
from django.shortcuts import redirect
from django.views import generic
from .models import Profile, UserInfo
from .forms import ProfileForm, UserInfoForm

class ProfileView(generic.TemplateView):
    template_name = 'profile.html'

    def get_context_data(self, **kwargs):
        context = super(ProfileView, self).get_context_data(**kwargs)
        user = self.request.user
        context['profile'], _ = Profile.objects.get_or_create(user=user)
        context['user_info'], _ = UserInfo.objects.get_or_create(user=user)
        context['profile_form'] = ProfileForm(instance=context['profile'])
        context['user_info_form'] = UserInfoForm(instance=context['user_info'])
        return context

    def post(self, request, *args, **kwargs):
        user = request.user
        profile, _ = Profile.objects.get_or_create(user=user)
        user_info, _ = UserInfo.objects.get_or_create(user=user)
        profile_form = ProfileForm(request.POST, instance=profile)
        user_info_form = UserInfoForm(request.POST, instance=user_info)

        if profile_form.is_valid() and user_info_form.is_valid():
            profile_form.save()
            user_info_form.save()
            return redirect('profile')

        return self.render_to_response(self.get_context_data(profile_form=profile_form, user_info_form=user_info_form))
