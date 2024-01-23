from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser, Profile, RegularUser, Trainer


# Formularios del usuario

class RegularUserCreationForm(UserCreationForm):
    class Meta:
        model = RegularUser
        fields = ('username', 'email', 'first_name', 'last_name', 'password1', 'password2')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
class TrainerCreationForm(UserCreationForm):
    class Meta:
        model = Trainer
        fields = ('username', 'email', 'first_name', 'last_name', 'password1', 'password2')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['bio', 'age', 'gender']
        
class RegularUserInfoForm(forms.ModelForm):
    class Meta:
        model = RegularUser
        fields = ['weight', 'height']
        
class TrainerInfoForm(forms.ModelForm):
    SPECIALTY_CHOICES = [
        ('weight', 'Weight loss'),
        ('muscle', 'Muscle gain'),
        ('strength', 'Strength'),
        ('endurance', 'Endurance'),
        ('flexibility', 'Flexibility'),
        ('other', 'Other'),
    ]
    
    specialty = forms.MultipleChoiceField(
        choices=SPECIALTY_CHOICES,
        widget=forms.CheckboxSelectMultiple,
        required=False
    )

    class Meta:
        model = Trainer
        fields = ['trainer_type', 'specialty']

    def __init__(self, *args, **kwargs):
        super(TrainerInfoForm, self).__init__(*args, **kwargs)
        if self.instance.pk:
            self.fields['specialty'].initial = self.instance.specialty.split(',')

    def save(self, commit=True):
        instance = super().save(commit=False)
        instance.specialty = ','.join(self.cleaned_data['specialty'])
        if commit:
            instance.save()
        return instance


