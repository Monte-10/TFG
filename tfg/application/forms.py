from django import forms
from django.contrib.auth.forms import UserCreationForm
from bootstrap_datepicker_plus.widgets import DatePickerInput
from django.forms.widgets import HiddenInput
from .models import CustomUser, Exercise, Training, TrainingExercise, Challenge, AlimentoVariable, AlimentoBase, ComidaBase, ComidaVariable, OpcionBase, OpcionVariable, PlanBase, PlanVariable, Calendario

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['gender', 'weight', 'height', 'age', 'waist_measurement', 'hip_measurement', 'goal', 'health_issues',
                  'blood_pressure', 'blood_sugar', 'daily_water_intake', 'diet_type', 'calorie_intake', 'lifestyle', 'other_goals']
        
        def clean_age(self):
            age = self.cleaned_data.get('age')
            if age < 0 or age > 99:
                raise forms.ValidationError("La edad debe estar entre 0 y 99 años.")
            return age
        
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
        model = ComidaVariable
        fields = ['comida_base', 'platos_variables']

        widgets = {
            'comida_base': forms.Select(attrs={'class': 'form-control'}),
            'platos_variables': forms.SelectMultiple(attrs={'class': 'form-control'}),
            'kcal': HiddenInput(),  # Use HiddenInput widget for invisible fields
            'proteina': HiddenInput(),
            'hc': HiddenInput(),
            'azucar': HiddenInput(),
            'fibra': HiddenInput(),
            'grasa': HiddenInput(),
            'grasa_sat': HiddenInput(),
            'apto_celiacos': HiddenInput(),
            'apto_lactosa': HiddenInput(),
            'apto_veganos': HiddenInput(),
            'apto_vegetarianos': HiddenInput(),
            'apto_pescetarianos': HiddenInput(),
            'carne': HiddenInput(),
            'verdura': HiddenInput(),
            'pescado_marisco': HiddenInput(),
            'enlatado_conserva': HiddenInput(),
            'cereal': HiddenInput(),
            'pasta_arroz': HiddenInput(),
            'lacteo_yogur_queso': HiddenInput(),
            'fruta': HiddenInput(),
            'fruto_seco': HiddenInput(),
            'legumbre': HiddenInput(),
            'salsa_condimento': HiddenInput(),
            'fiambre': HiddenInput(),
            'pan_panMolde_tostada': HiddenInput(),
            'huevo': HiddenInput(),
            'suplemento_bebida_especial': HiddenInput(),
            'tuberculo': HiddenInput(),
            'otros': HiddenInput(),
        }

    def clean(self):
        cleaned_data = super().clean()
        platos = cleaned_data.get('platos')
        
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
        pescado_marisco = False
        enlatado_conserva = False
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

        if platos:
            for plato in platos:
                kcal += plato.kcal
                proteina += plato.proteina
                hc += plato.hc
                azucar += plato.azucar
                fibra += plato.fibra
                grasa += plato.grasa
                grasa_sat += plato.grasa_sat

                apto_celiacos = apto_celiacos and plato.apto_celiacos
                apto_lactosa = apto_lactosa and plato.apto_lactosa
                apto_veganos = apto_veganos and plato.apto_veganos
                apto_vegetarianos = apto_vegetarianos and plato.apto_vegetarianos
                apto_pescetarianos = apto_pescetarianos and plato.apto_pescetarianos
                carne = carne or plato.carne
                verdura = verdura or plato.verdura
                pescado_marisco = pescado_marisco or plato.pescado_marisco
                enlatado_conserva = enlatado_conserva or plato.enlatado_conserva
                cereal = cereal or plato.cereal
                pasta_arroz = pasta_arroz or plato.pasta_arroz
                lacteo_yogur_queso = lacteo_yogur_queso or plato.lacteo_yogur_queso
                fruta = fruta or plato.fruta
                fruto_seco = fruto_seco or plato.fruto_seco
                legumbre = legumbre or plato.legumbre
                salsa_condimento = salsa_condimento or plato.salsa_condimento
                fiambre = fiambre or plato.fiambre
                pan_panMolde_tostada = pan_panMolde_tostada or plato.pan_panMolde_tostada
                huevo = huevo or plato.huevo
                suplemento_bebida_especial = suplemento_bebida_especial or plato.suplemento_bebida_especial
                tuberculo = tuberculo or plato.tuberculo
                otros = otros or plato.otros

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
        cleaned_data['pescado_marisco'] = pescado_marisco
        cleaned_data['enlatado_conserva'] = enlatado_conserva
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

class OpcionForm(forms.ModelForm):
    class Meta:
        model = OpcionVariable
        fields = ['opcion', 'desayuno', 'almuerzo', 'comida', 'merienda', 'cena']
        
        widgets = {
            'opcion': forms.Select(attrs={'class': 'form-control'}),
            'desayuno': forms.Select(attrs={'class': 'form-control'}),
            'almuerzo': forms.Select(attrs={'class': 'form-control'}),
            'comida': forms.Select(attrs={'class': 'form-control'}),
            'merienda': forms.Select(attrs={'class': 'form-control'}),
            'cena': forms.Select(attrs={'class': 'form-control'}),
            'kcal': HiddenInput(),
            'proteina': HiddenInput(),
            'hc': HiddenInput(),
            'azucar': HiddenInput(),
            'fibra': HiddenInput(),
            'grasa': HiddenInput(),
            'grasa_sat': HiddenInput(),
            'apto_celiacos': HiddenInput(),
            'apto_lactosa': HiddenInput(),
            'apto_veganos': HiddenInput(),
            'apto_vegetarianos': HiddenInput(),
            'apto_pescetarianos': HiddenInput(),
            'carne': HiddenInput(),
            'verdura': HiddenInput(),
            'pescado_marisco': HiddenInput(),
            'enlatado_conserva': HiddenInput(),
            'cereal': HiddenInput(),
            'pasta_arroz': HiddenInput(),
            'lacteo_yogur_queso': HiddenInput(),
            'fruta': HiddenInput(),
            'fruto_seco': HiddenInput(),
            'legumbre': HiddenInput(),
            'salsa_condimento': HiddenInput(),
            'fiambre': HiddenInput(),
            'pan_panMolde_tostada': HiddenInput(),
            'huevo': HiddenInput(),
            'suplemento_bebida_especial': HiddenInput(),
            'tuberculo': HiddenInput(),
            'otros': HiddenInput(),
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
        pescado_marisco = False
        enlatado_conserva = False
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
                pescado_marisco = pescado_marisco or comida.pescado_marisco
                enlatado_conserva = enlatado_conserva or comida.enlatado_conserva
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
        cleaned_data['pescado_marisco'] = pescado_marisco
        cleaned_data['enlatado_conserva'] = enlatado_conserva
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

from datetime import timedelta
import datetime

class PlanForm(forms.ModelForm):
    class Meta:
        model = PlanVariable
        fields = ['cliente', 'plan', 'start_date', 'end_date', 'suplementos', 'notas', 'goal', 'opcion1', 'opcion2', 'opcion3']

    opcion1 = forms.ModelChoiceField(
        queryset=OpcionVariable.objects.all(),
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'}),
    )

    opcion2 = forms.ModelChoiceField(
        queryset=OpcionVariable.objects.all(),
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'}),
    )

    opcion3 = forms.ModelChoiceField(
        queryset=OpcionVariable.objects.all(),
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'}),
    )
    
    # Agregar el widget DatePicker a los campos de fecha y ponemos default de inicio hoy y final en 7 días
    start_date = forms.DateField(widget=DatePickerInput(format='%d-%m-%Y'), initial=datetime.date.today())
    end_date = forms.DateField(widget=DatePickerInput(format='%d-%m-%Y'), initial=datetime.date.today() + timedelta(days=7))
    
    cliente = forms.ModelChoiceField(
        queryset=CustomUser.objects.filter(role='cliente'),
        required=True,
        widget=forms.Select(attrs={'class': 'form-control'}),
    )

class CalendarioFechaOpcionForm(forms.ModelForm):
    class Meta:
        model = Calendario
        fields = ['fecha', 'opcion']

    def __init__(self, *args, **kwargs):
        plan = kwargs.pop('plan', None)  # Extract the plan from kwargs
        super(CalendarioFechaOpcionForm, self).__init__(*args, **kwargs)
        
        # If we have a plan, adjust the queryset for the 'opcion' field to only include the plan's options
        if plan:
            self.fields['opcion'].queryset = OpcionVariable.objects.filter(id__in=[plan.opcion1.id, plan.opcion2.id, plan.opcion3.id])


class AlimentoForm(forms.ModelForm):
    class Meta:
        model = AlimentoBase
        fields = '__all__'
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            # Add other fields and widgets as needed
        }
