from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    password = forms.CharField(widget=forms.PasswordInput(), label="Contraseña")
    email = forms.EmailField(required=True, label="Correo Electrónico")

    class Meta:
        model = CustomUser
        fields = [
            "username",
            "password",
            "email",
            "gender",
            "weight",
            "height",
            "age",
            "waist_measurement",
            "hip_measurement",
            "goal",
            "health_issues",
            "blood_pressure",
            "blood_sugar",
            "daily_water_intake",
            "diet_type",
            "calorie_intake",
            "lifestyle",
            "other_goals",
           
        ]

    def save(self, commit=True):
        # Aquí, utilizamos el método save() original pero añadimos el email y la contraseña
        user = super(CustomUserCreationForm, self).save(commit=False)
        user.email = self.cleaned_data["email"]
        user.set_password(self.cleaned_data["password"])

        if commit:
            user.save()
        return user

    def clean_email(self):
        email = self.cleaned_data.get('email')
        # Verifica que no exista otro usuario con el mismo correo
        if CustomUser.objects.filter(email=email).exists():
            raise forms.ValidationError("Este correo electrónico ya está en uso.")
        return email
