from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser, Exercise

class CustomUserBaseForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
    def _disable_fields(self):
        if self.initial.get('role') == 'entrenador' or ('role' in self.data and self.data['role'] == 'entrenador'):
            fields_to_disable = [
                "gender", "weight", "height", "age", "waist_measurement", 
                "hip_measurement", "goal", "health_issues", "blood_pressure",
                "blood_sugar", "daily_water_intake", "diet_type", "calorie_intake", 
                "lifestyle", "other_goals",
            ]
            for field_name in fields_to_disable:
                self.fields[field_name].widget.attrs['disabled'] = True
                self.fields[field_name].required = False  # Establece los campos como no requeridos
                
class CustomUserCreationForm(CustomUserBaseForm, UserCreationForm):
    email = forms.EmailField(required=True, label="Correo Electrónico")
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)    
        self._disable_fields()

    class Meta:
        model = CustomUser
        fields = [
            "username", "password1", "password2", "email", "role",
            "gender", "weight", "height", "age", "waist_measurement",
            "hip_measurement", "goal", "health_issues", "blood_pressure",
            "blood_sugar", "daily_water_intake", "diet_type", "calorie_intake",
            "lifestyle", "other_goals",
        ]

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]
        
        if commit:
            user.save()
        return user

    def clean_email(self):
        email = self.cleaned_data.get('email')
        
        # Si el formulario ya está asociado a una instancia de un modelo, es decir, estamos actualizando un usuario.
        if self.instance:
            # Si el email no ha cambiado, simplemente devuélvelo.
            if self.instance.email == email:
                return email
            
        # Si estamos creando un nuevo usuario, o si estamos actualizando el email de un usuario existente.
        if CustomUser.objects.filter(email=email).exclude(pk=self.instance.pk).exists():
            raise forms.ValidationError("Este correo electrónico ya está en uso.")
        
        return email
    
    def clean(self):
        cleaned_data = super().clean()
        role = cleaned_data.get("role")
        
        if role == "entrenador":
            # Hacer los campos no requeridos si el usuario es un entrenador
            for field in ["gender", "goal", "lifestyle", "weight", "height", "age"]:
                self.fields[field].required = False
        return cleaned_data
    
    def clean_gender(self):
        gender = self.cleaned_data.get('gender')
        role = self.cleaned_data.get('role')
        if role == "cliente" and not gender:
            raise forms.ValidationError("El campo Género es obligatorio para el rol cliente.")
        return gender

    def clean_goal(self):
        goal = self.cleaned_data.get('goal')
        role = self.cleaned_data.get('role')
        if role == "cliente" and not goal:
            raise forms.ValidationError("El campo Objetivo es obligatorio para el rol cliente.")
        return goal

    def clean_lifestyle(self):
        lifestyle = self.cleaned_data.get('lifestyle')
        role = self.cleaned_data.get('role')
        if role == "cliente" and not lifestyle:
            raise forms.ValidationError("El campo Estilo de vida es obligatorio para el rol cliente.")
        return lifestyle

    def clean_weight(self):
        weight = self.cleaned_data.get('weight')
        role = self.cleaned_data.get('role')
        if role == "cliente" and not weight:
            raise forms.ValidationError("El campo Peso es obligatorio para el rol cliente.")
        return weight

    def clean_height(self):
        height = self.cleaned_data.get('height')
        role = self.cleaned_data.get('role')
        if role == "cliente" and not height:
            raise forms.ValidationError("El campo Altura es obligatorio para el rol cliente.")
        return height

    def clean_age(self):
        age = self.cleaned_data.get('age')
        role = self.cleaned_data.get('role')
        if role == "cliente" and not age:
            raise forms.ValidationError("El campo Edad es obligatorio para el rol cliente.")
        return age
    
class CustomUserUpdateForm(CustomUserBaseForm):
    email = forms.EmailField(required=True, label="Correo Electrónico")
    
    class Meta:
        model = CustomUser
        # Se excluyen los campos de contraseña para la actualización.
        fields = [
            "username", "email", "role",
            "gender", "weight", "height", "age", "waist_measurement",
            "hip_measurement", "goal", "health_issues", "blood_pressure",
            "blood_sugar", "daily_water_intake", "diet_type", "calorie_intake",
            "lifestyle", "other_goals",
        ]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._disable_fields()

    def clean_email(self):
        email = self.cleaned_data.get('email')
        
        # Si el formulario ya está asociado a una instancia de un modelo, es decir, estamos actualizando un usuario.
        if self.instance:
            # Si el email no ha cambiado, simplemente devuélvelo.
            if self.instance.email == email:
                return email
        # Si estamos creando un nuevo usuario, o si estamos actualizando el email de un usuario existente.
        if CustomUser.objects.filter(email=email).exclude(pk=self.instance.pk).exists():
            raise forms.ValidationError("Este correo electrónico ya está en uso.")
        return email

    def clean(self):
        cleaned_data = super().clean()
        role = cleaned_data.get("role")
        
        if role == "entrenador":
            # Hacer los campos no requeridos si el usuario es un entrenador
            for field in ["gender", "goal", "lifestyle", "weight", "height", "age"]:
                self.fields[field].required = False
        return cleaned_data
    
class ExerciseForm(forms.ModelForm):
    class Meta:
        model = Exercise
        fields = ['name', 'video_url', 'description', 'target']

        # Opcionalmente, si deseas especificar etiquetas personalizadas o widgets:
        labels = {
            'name': 'Nombre del ejercicio',
            'video_url': 'URL del video',
            'description': 'Descripción',
            'target': 'Grupo muscular objetivo',
        }
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'video_url': forms.URLInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control'}),
            'target': forms.SelectMultiple(attrs={'class': 'form-control'}),
        }