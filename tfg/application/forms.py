from django import forms
from django.contrib.auth.forms import UserCreationForm
from bootstrap_datepicker_plus import DatePickerInput
from .models import CustomUser, Exercise, Training, TrainingExercise, Challenge, Alimento, Comida, DiaDeDieta, Dieta

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
    
class TrainingForm(forms.ModelForm):
    class Meta:
        model = Training
        fields = ['cliente', 'name', 'description', 'approximate_duration', 'muscle_groups', 'note', 'date', 'exercises']

        widgets = {
            'cliente': forms.Select(attrs={'class': 'form-control'}),
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control'}),
            'approximate_duration': forms.TextInput(attrs={'class': 'form-control'}),  # Cambio aquí
            'muscle_groups': forms.SelectMultiple(attrs={'class': 'form-control'}),
            'note': forms.Textarea(attrs={'class': 'form-control'}),
            'date': forms.DateInput(attrs={'class': 'form-control'}),
            'exercises': forms.SelectMultiple(attrs={'class': 'form-control'}),
        }

class ComidaForm(forms.ModelForm):
    class Meta:
        model = Comida
        fields = ['name', 'alimentos', 'kcal', 'proteina', 'hc', 'azucar',
                  'fibra', 'grasa', 'grasa_sat', 'apto_celiacos', 'apto_lactosa',
                  'apto_veganos', 'apto_vegetarianos', 'apto_pescetarianos',
                  'carne', 'verdura', 'pescado_marisco_enlatado_conserva', 'cereal',
                  'pasta_arroz', 'lacteo_yogur_queso', 'fruta', 'fruto_seco', 'legumbre',
                  'salsa_condimento', 'fiambre', 'pan_panMolde_tostada', 'huevo',
                  'suplemento_bebida_especial', 'tuberculo', 'otros']

        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'alimentos': forms.SelectMultiple(attrs={'class': 'form-control'}),
            'kcal': forms.TextInput(attrs={'class': 'form-control', 'readonly': 'readonly'}),
            'proteina': forms.TextInput(attrs={'class': 'form-control', 'readonly': 'readonly'}),
            'hc': forms.TextInput(attrs={'class': 'form-control', 'readonly': 'readonly'}),
            'azucar': forms.TextInput(attrs={'class': 'form-control', 'readonly': 'readonly'}),
            'fibra': forms.TextInput(attrs={'class': 'form-control', 'readonly': 'readonly'}),
            'grasa': forms.TextInput(attrs={'class': 'form-control', 'readonly': 'readonly'}),
            'grasa_sat': forms.TextInput(attrs={'class': 'form-control', 'readonly': 'readonly'}),
            'apto_celiacos': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'apto_lactosa': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'apto_veganos': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'apto_vegetarianos': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'apto_pescetarianos': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'carne': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'verdura': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'pescado_marisco_enlatado_conserva': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'cereal': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'pasta_arroz': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'lacteo_yogur_queso': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'fruta': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'fruto_seco': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'legumbre': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'salsa_condimento': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'fiambre': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'pan_panMolde_tostada': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'huevo': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'suplemento_bebida_especial': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'tuberculo': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'otros': forms.CheckboxInput(attrs={'class': 'form-control'}),
        }

    def clean(self):
        cleaned_data = super().clean()
        alimentos = cleaned_data.get('alimentos')
        
        # Inicializar todas las variables
        kcal = 0
        proteina = 0
        hc = 0
        azucar = 0
        fibra = 0
        grasa = 0
        grasa_sat = 0
        apto_celiacos = True  # Puedes inicializar esto como True si tiene sentido en tu caso
        apto_lactosa = True
        apto_veganos = True
        apto_vegetarianos = True
        apto_pescetarianos = True
        carne = False
        verdura = False
        pescado_marisco_enlatado_conserva = False
        cereal = False
        pasta_arroz = False
        lacteo_yogur_queso = False
        fruta = False
        fruto_seco = False
        legumbre = False
        salsa_condimento = False
        fiambre = False
        pan_panMolde_tostada = False
        huevo = False
        suplemento_bebida_especial = False
        tuberculo = False
        otros = False

        if alimentos:
            for alimento in alimentos:
                kcal += alimento.kcal
                proteina += alimento.proteina
                hc += alimento.hc
                azucar += alimento.azucar
                fibra += alimento.fibra
                grasa += alimento.grasa
                grasa_sat += alimento.grasa_sat

                apto_celiacos = apto_celiacos and alimento.apto_celiacos
                apto_lactosa = apto_lactosa and alimento.apto_lactosa
                apto_veganos = apto_veganos and alimento.apto_veganos
                apto_vegetarianos = apto_vegetarianos and alimento.apto_vegetarianos
                apto_pescetarianos = apto_pescetarianos and alimento.apto_pescetarianos
                carne = carne or alimento.carne
                verdura = verdura or alimento.verdura
                pescado_marisco_enlatado_conserva = pescado_marisco_enlatado_conserva or alimento.pescado_marisco_enlatado_conserva
                cereal = cereal or alimento.cereal
                pasta_arroz = pasta_arroz or alimento.pasta_arroz
                lacteo_yogur_queso = lacteo_yogur_queso or alimento.lacteo_yogur_queso
                fruta = fruta or alimento.fruta
                fruto_seco = fruto_seco or alimento.fruto_seco
                legumbre = legumbre or alimento.legumbre
                salsa_condimento = salsa_condimento or alimento.salsa_condimento
                fiambre = fiambre or alimento.fiambre
                pan_panMolde_tostada = pan_panMolde_tostada or alimento.pan_panMolde_tostada
                huevo = huevo or alimento.huevo
                suplemento_bebida_especial = suplemento_bebida_especial or alimento.suplemento_bebida_especial
                tuberculo = tuberculo or alimento.tuberculo
                otros = otros or alimento.otros

        # Actualizar los valores en el formulario
        cleaned_data['kcal'] = kcal
        cleaned_data['proteina'] = proteina
        cleaned_data['hc'] = hc
        cleaned_data['azucar'] = azucar
        cleaned_data['fibra'] = fibra
        cleaned_data['grasa'] = grasa
        cleaned_data['grasa_sat'] = grasa_sat
        cleaned_data['apto_celiacos'] = apto_celiacos
        cleaned_data['apto_lactosa'] = apto_lactosa
        cleaned_data['apto_veganos'] = apto_veganos
        cleaned_data['apto_vegetarianos'] = apto_vegetarianos
        cleaned_data['apto_pescetarianos'] = apto_pescetarianos
        cleaned_data['carne'] = carne
        cleaned_data['verdura'] = verdura
        cleaned_data['pescado_marisco_enlatado_conserva'] = pescado_marisco_enlatado_conserva
        cleaned_data['cereal'] = cereal
        cleaned_data['pasta_arroz'] = pasta_arroz
        cleaned_data['lacteo_yogur_queso'] = lacteo_yogur_queso
        cleaned_data['fruta'] = fruta
        cleaned_data['fruto_seco'] = fruto_seco
        cleaned_data['legumbre'] = legumbre
        cleaned_data['salsa_condimento'] = salsa_condimento
        cleaned_data['fiambre'] = fiambre
        cleaned_data['pan_panMolde_tostada'] = pan_panMolde_tostada
        cleaned_data['huevo'] = huevo
        cleaned_data['suplemento_bebida_especial'] = suplemento_bebida_especial
        cleaned_data['tuberculo'] = tuberculo
        cleaned_data['otros'] = otros
        return cleaned_data

class DiaDeDietaForm(forms.ModelForm):
    class Meta:
        model = DiaDeDieta
        fields = ['name', 'cliente', 'desayuno', 'almuerzo', 'comida', 'merienda', 'cena', 'kcal', 'proteina', 'hc', 'azucar',
                  'fibra', 'grasa', 'grasa_sat', 'apto_celiacos', 'apto_lactosa',
                  'apto_veganos', 'apto_vegetarianos', 'apto_pescetarianos',
                  'carne', 'verdura', 'pescado_marisco_enlatado_conserva', 'cereal',
                  'pasta_arroz', 'lacteo_yogur_queso', 'fruta', 'fruto_seco', 'legumbre',
                  'salsa_condimento', 'fiambre', 'pan_panMolde_tostada', 'huevo',
                  'suplemento_bebida_especial', 'tuberculo', 'otros']
        
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'cliente': forms.Select(attrs={'class': 'form-control'}),
            'desayuno': forms.Select(attrs={'class': 'form-control'}),
            'almuerzo': forms.Select(attrs={'class': 'form-control'}),
            'comida': forms.Select(attrs={'class': 'form-control'}),
            'merienda': forms.Select(attrs={'class': 'form-control'}),
            'cena': forms.Select(attrs={'class': 'form-control'}),
            'kcal': forms.TextInput(attrs={'class': 'form-control', 'readonly': 'readonly'}),
            'proteina': forms.TextInput(attrs={'class': 'form-control', 'readonly': 'readonly'}),
            'hc': forms.TextInput(attrs={'class': 'form-control', 'readonly': 'readonly'}),
            'azucar': forms.TextInput(attrs={'class': 'form-control', 'readonly': 'readonly'}),
            'fibra': forms.TextInput(attrs={'class': 'form-control', 'readonly': 'readonly'}),
            'grasa': forms.TextInput(attrs={'class': 'form-control', 'readonly': 'readonly'}),
            'grasa_sat': forms.TextInput(attrs={'class': 'form-control', 'readonly': 'readonly'}),
            'apto_celiacos': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'apto_lactosa': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'apto_veganos': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'apto_vegetarianos': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'apto_pescetarianos': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'carne': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'verdura': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'pescado_marisco_enlatado_conserva': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'cereal': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'pasta_arroz': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'lacteo_yogur_queso': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'fruta': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'fruto_seco': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'legumbre': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'salsa_condimento': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'fiambre': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'pan_panMolde_tostada': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'huevo': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'suplemento_bebida_especial': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'tuberculo': forms.CheckboxInput(attrs={'class': 'form-control'}),
            'otros': forms.CheckboxInput(attrs={'class': 'form-control'}),
        }
    
    def clean(self):
        cleaned_data = super().clean()
        comidas = [cleaned_data.get('desayuno'), cleaned_data.get('almuerzo'), cleaned_data.get('comida'),
                   cleaned_data.get('merienda'), cleaned_data.get('cena')]
        
        # Inicializar todas las variables
        kcal = 0
        proteina = 0
        hc = 0
        azucar = 0
        fibra = 0
        grasa = 0
        grasa_sat = 0
        apto_celiacos = False
        apto_lactosa = False
        apto_veganos = False
        apto_vegetarianos = False
        apto_pescetarianos = False
        carne = False
        verdura = False
        pescado_marisco_enlatado_conserva = False
        cereal = False
        pasta_arroz = False
        lacteo_yogur_queso = False
        fruta = False
        fruto_seco = False
        legumbre = False
        salsa_condimento = False
        fiambre = False
        pan_panMolde_tostada = False
        huevo = False
        suplemento_bebida_especial = False
        tuberculo = False
        otros = False
        
        for comida in comidas:
            if comida:
                kcal += comida.kcal
                proteina += comida.proteina
                hc += comida.hc
                azucar += comida.azucar
                fibra += comida.fibra
                grasa += comida.grasa
                grasa_sat += comida.grasa_sat

                apto_celiacos = apto_celiacos or comida.apto_celiacos
                apto_lactosa = apto_lactosa or comida.apto_lactosa
                apto_veganos = apto_veganos or comida.apto_veganos
                apto_vegetarianos = apto_vegetarianos or comida.apto_vegetarianos
                apto_pescetarianos = apto_pescetarianos or comida.apto_pescetarianos
                carne = carne or comida.carne
                verdura = verdura or comida.verdura
                pescado_marisco_enlatado_conserva = pescado_marisco_enlatado_conserva or comida.pescado_marisco_enlatado_conserva
                cereal = cereal or comida.cereal
                pasta_arroz = pasta_arroz or comida.pasta_arroz
                lacteo_yogur_queso = lacteo_yogur_queso or comida.lacteo_yogur_queso
                fruta = fruta or comida.fruta
                fruto_seco = fruto_seco or comida.fruto_seco
                legumbre = legumbre or comida.legumbre
                salsa_condimento = salsa_condimento or comida.salsa_condimento
                fiambre = fiambre or comida.fiambre
                pan_panMolde_tostada = pan_panMolde_tostada or comida.pan_panMolde_tostada
                huevo = huevo or comida.huevo
                suplemento_bebida_especial = suplemento_bebida_especial or comida.suplemento_bebida_especial
                tuberculo = tuberculo or comida.tuberculo
                otros = otros or comida.otros
                
        # Actualizar los valores en el formulario
        cleaned_data['kcal'] = kcal
        cleaned_data['proteina'] = proteina
        cleaned_data['hc'] = hc
        cleaned_data['azucar'] = azucar
        cleaned_data['fibra'] = fibra
        cleaned_data['grasa'] = grasa
        cleaned_data['grasa_sat'] = grasa_sat
        cleaned_data['apto_celiacos'] = apto_celiacos
        cleaned_data['apto_lactosa'] = apto_lactosa
        cleaned_data['apto_veganos'] = apto_veganos
        cleaned_data['apto_vegetarianos'] = apto_vegetarianos
        cleaned_data['apto_pescetarianos'] = apto_pescetarianos
        cleaned_data['carne'] = carne
        cleaned_data['verdura'] = verdura
        cleaned_data['pescado_marisco_enlatado_conserva'] = pescado_marisco_enlatado_conserva
        cleaned_data['cereal'] = cereal
        cleaned_data['pasta_arroz'] = pasta_arroz
        cleaned_data['lacteo_yogur_queso'] = lacteo_yogur_queso
        cleaned_data['fruta'] = fruta
        cleaned_data['fruto_seco'] = fruto_seco
        cleaned_data['legumbre'] = legumbre
        cleaned_data['salsa_condimento'] = salsa_condimento
        cleaned_data['fiambre'] = fiambre
        cleaned_data['pan_panMolde_tostada'] = pan_panMolde_tostada
        cleaned_data['huevo'] = huevo
        cleaned_data['suplemento_bebida_especial'] = suplemento_bebida_especial
        cleaned_data['tuberculo'] = tuberculo
        cleaned_data['otros'] = otros
        return cleaned_data
 
class DietaForm(forms.ModelForm):
    class Meta:
        model = Dieta
        fields = ['cliente', 'name', 'description', 'start_date', 'end_date', 'goal']

    dias = forms.ModelMultipleChoiceField(
        queryset=DiaDeDieta.objects.all(),
        widget=forms.CheckboxSelectMultiple,  # Puedes cambiar esto a otra forma de selección si lo deseas
    )

    # Agregar el widget DatePicker a los campos de fecha
    start_date = forms.DateField(widget=DatePickerInput(format='%Y-%m-%d'))
    end_date = forms.DateField(widget=DatePickerInput(format='%Y-%m-%d'))
