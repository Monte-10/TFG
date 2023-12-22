from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser, Profile, UserInfo


# Formularios del usuario

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'first_name', 'last_name', 'password1', 'password2', 'user_type')

    def __init__(self, *args, **kwargs):
        super(CustomUserCreationForm, self).__init__(*args, **kwargs)
        self.fields['user_type'].required = True
        
class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['bio', 'age', 'gender']
        
class UserInfoForm(forms.ModelForm):
    class Meta:
        model = UserInfo
        fields = ['weight', 'height', 'weekly_exercise']