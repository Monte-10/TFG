from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from datetime import date


# ----------  DEPORTE  ------------ #

class MuscleGroup(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)  # Una breve descripción del grupo muscular, si es necesario

    def __str__(self):
        return self.name
    
class CustomUser(AbstractUser):
    
    ROLE_CHOICES = [
        ('cliente', 'Cliente'),
        ('entrenador', 'Entrenador'),
    ]
    
    GENDER_CHOICES = [
        ('Hombre', 'Hombre'),
        ('Mujer', 'Mujer'),
        ('Otro', 'Otro'),
    ]
    
    GOAL_CHOICES = [
        ('Perder peso', 'Perder peso'),
        ('Ganar masa muscular', 'Ganar masa muscular'),
        ('Mantenerse en forma', 'Mantenerse en forma'),
    ]
    
    LIFE_STYLE_CHOICES = [
        ('Sedentario', 'Sedentario'),
        ('Ligero', 'Ligero'),
        ('Moderado', 'Moderado'),
        ('Activo', 'Activo'),
        ('Muy activo', 'Muy activo'),
    ]

    # Extended fields for the user
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='cliente')
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    waist_measurement = models.FloatField(null=True, blank=True)
    hip_measurement = models.FloatField(null=True, blank=True)
    goal = models.CharField(max_length=50, choices=GOAL_CHOICES, null=True, blank=True)
    health_issues = models.CharField(max_length=50, null=True, blank=True)
    blood_pressure = models.FloatField(null=True, blank=True)
    blood_sugar = models.FloatField(null=True, blank=True)
    daily_water_intake = models.FloatField(null=True, blank=True)
    diet_type = models.CharField(max_length=50, null=True, blank=True)
    calorie_intake = models.FloatField(null=True, blank=True)
    lifestyle = models.CharField(max_length=50, choices=LIFE_STYLE_CHOICES, null=True, blank=True)
    other_goals = models.CharField(max_length=50, null=True, blank=True)
    entrenador = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='clientes')
    
    def __str__(self):
        return self.username
    
class Exercise(models.Model):
    name = models.CharField(max_length=100)
    video_url = models.URLField()
    description = models.TextField()
    target = models.ManyToManyField(MuscleGroup)  # Relación con el modelo MuscleGroup
    
    def __str__(self):
        return self.name

class Training(models.Model):
    cliente = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, related_name='entrenamientos')
    name = models.CharField(max_length=100)
    description = models.TextField()
    approximate_duration = models.DurationField()
    muscle_groups = models.ManyToManyField(MuscleGroup)  # Relación con el modelo MuscleGroup, reemplazando el TextField anterior
    note = models.TextField(null=True, blank=True)
    date = models.DateField(default=date.today, null=True, blank=True)
    exercises = models.ManyToManyField(Exercise, through='TrainingExercise')
    
    def __str__(self):
        return self.name

class TrainingExercise(models.Model):
    training = models.ForeignKey(Training, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    repetitions = models.IntegerField(default=1)
    sets = models.IntegerField(default=1)
    order = models.PositiveIntegerField(default=0)

class ActivityRecord(models.Model):
    ACTIVITY_TYPE = [
        ('Caminar', 'Caminar'),
        ('Correr', 'Correr'),
        ('Nadar', 'Nadar'),
        ('Bicicleta', 'Bicicleta'),
        ('Ejercicio en casa', 'Ejercicio en casa'),
        ('Ejercicio en gimnasio', 'Ejercicio en gimnasio'),
        ('Otro', 'Otro'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField(default=date.today, null=True, blank=True)
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPE)
    duration = models.DurationField(null=True, blank=True)
    calories_burned = models.FloatField(null=True, blank=True)

class Challenge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    goal = models.TextField(null=True, blank=True)
    participants = models.ManyToManyField(CustomUser, through='UserChallenge')

class UserChallenge(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    completed_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50)  # ej. "completado", "en progreso", etc.
    
class TrainingRequest(models.Model):
    client = models.ForeignKey(CustomUser, related_name='training_requests_made', on_delete=models.CASCADE)
    trainer = models.ForeignKey(CustomUser, related_name='training_requests_received', on_delete=models.CASCADE)
    
    STATUS_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('aceptada', 'Aceptada'),
        ('rechazada', 'Rechazada'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendiente')

    def __str__(self):
        return f"Request from {self.client} to {self.trainer} - {self.status}"
    
    
# ----------  DIETA  ------------ #

class AlimentoBase(models.Model):
    name = models.CharField(max_length=100)
    cantidad = models.FloatField(default=100)
    kcal = models.IntegerField(default=0)
    proteina = models.FloatField(default=0)
    hc = models.FloatField(default=0)
    azucar = models.FloatField(default=0)
    fibra = models.FloatField(default=0)
    grasa = models.FloatField(default=0)
    grasa_sat = models.FloatField(default=0)
    apto_celiacos = models.BooleanField(default=False)
    apto_lactosa = models.BooleanField(default=False)
    apto_veganos = models.BooleanField(default=False)
    apto_vegetarianos = models.BooleanField(default=False)
    apto_pescetarianos = models.BooleanField(default=False)
    carne = models.BooleanField(default=False)
    verdura = models.BooleanField(default=False)
    pescado_marisco = models.BooleanField(default=False)
    enlatado_conserva = models.BooleanField(default=False)
    cereal = models.BooleanField(default=False)
    pasta_arroz = models.BooleanField(default=False)
    lacteo_yogur_queso = models.BooleanField(default=False)
    fruta = models.BooleanField(default=False)
    fruto_seco = models.BooleanField(default=False)
    legumbre = models.BooleanField(default=False)
    salsa_condimento = models.BooleanField(default=False)
    fiambre = models.BooleanField(default=False)
    pan_panMolde_tostada = models.BooleanField(default=False)
    huevo = models.BooleanField(default=False)
    suplemento_bebida_especial = models.BooleanField(default=False)
    tuberculo = models.BooleanField(default=False)
    otros = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name
    
class AlimentoVariable(models.Model):
    alimento_base = models.ForeignKey(AlimentoBase, on_delete=models.CASCADE, null=True, blank=True)
    cantidad = models.FloatField(default=100)
    
    @property
    def name(self):
        return self.alimento_base.name
    
    @property
    def kcal(self):
        return (self.cantidad / self.alimento_base.cantidad) * self.alimento_base.kcal
    
    @property
    def proteina(self):
        return (self.cantidad / self.alimento_base.cantidad) * self.alimento_base.proteina
    
    @property
    def hc(self):
        return (self.cantidad / self.alimento_base.cantidad) * self.alimento_base.hc
    
    @property
    def azucar(self):
        return (self.cantidad / self.alimento_base.cantidad) * self.alimento_base.azucar
    
    @property
    def fibra(self):
        return (self.cantidad / self.alimento_base.cantidad) * self.alimento_base.fibra
    
    @property
    def grasa(self):
        return (self.cantidad / self.alimento_base.cantidad) * self.alimento_base.grasa
    
    @property
    def grasa_sat(self):
        return (self.cantidad / self.alimento_base.cantidad) * self.alimento_base.grasa_sat
    
    @property
    def apto_celiacos(self):
        return self.alimento_base.apto_celiacos
    
    @property
    def apto_lactosa(self):
        return self.alimento_base.apto_lactosa
    
    @property
    def apto_veganos(self):
        return self.alimento_base.apto_veganos
    
    @property
    def apto_vegetarianos(self):
        return self.alimento_base.apto_vegetarianos
    
    @property
    def apto_pescetarianos(self):
        return self.alimento_base.apto_pescetarianos
    
    @property
    def carne(self):
        return self.alimento_base.carne
    
    @property
    def verdura(self):
        return self.alimento_base.verdura
    
    @property
    def pescado_marisco(self):
        return self.alimento_base.pescado_marisco
    
    @property
    def enlatado_conserva(self):
        return self.alimento_base.enlatado_conserva
    
    @property
    def cereal(self):
        return self.alimento_base.cereal
    
    @property
    def pasta_arroz(self):
        return self.alimento_base.pasta_arroz
    
    @property
    def lacteo_yogur_queso(self):
        return self.alimento_base.lacteo_yogur_queso
    
    @property
    def fruta(self):
        return self.alimento_base.fruta
    
    @property
    def fruto_seco(self):
        return self.alimento_base.fruto_seco
    
    @property
    def legumbre(self):
        return self.alimento_base.legumbre
    
    @property
    def salsa_condimento(self):
        return self.alimento_base.salsa_condimento
    
    @property
    def fiambre(self):
        return self.alimento_base.fiambre
    
    @property
    def pan_panMolde_tostada(self):
        return self.alimento_base.pan_panMolde_tostada
    
    @property
    def huevo(self):
        return self.alimento_base.huevo
    
    @property
    def suplemento_bebida_especial(self):
        return self.alimento_base.suplemento_bebida_especial
    
    @property
    def tuberculo(self):
        return self.alimento_base.tuberculo
    
    @property
    def otros(self):
        return self.alimento_base.otros
    
    def __str__(self):
        return f'{self.alimento_base.name} - {self.cantidad}g'

class PlatoBase(models.Model):
    name = models.CharField(max_length=100)
    alimentos = models.ManyToManyField(AlimentoVariable)
    
    @property
    def kcal(self):
        return sum([alimento.kcal for alimento in self.alimentos.all()])
    
    @property
    def proteina(self):
        return sum([alimento.proteina for alimento in self.alimentos.all()])
    
    @property
    def hc(self):
        return sum([alimento.hc for alimento in self.alimentos.all()])
    
    @property
    def azucar(self):
        return sum([alimento.azucar for alimento in self.alimentos.all()])
    
    @property
    def fibra(self):
        return sum([alimento.fibra for alimento in self.alimentos.all()])
    
    @property
    def grasa(self):
        return sum([alimento.grasa for alimento in self.alimentos.all()])
    
    @property
    def grasa_sat(self):
        return sum([alimento.grasa_sat for alimento in self.alimentos.all()])
    
    @property
    def apto_celiacos(self):
        return all([alimento.apto_celiacos for alimento in self.alimentos.all()])
    
    @property
    def apto_lactosa(self):
        return all([alimento.apto_lactosa for alimento in self.alimentos.all()])
    
    @property
    def apto_veganos(self):
        return all([alimento.apto_veganos for alimento in self.alimentos.all()])
    
    @property
    def apto_vegetarianos(self):
        return all([alimento.apto_vegetarianos for alimento in self.alimentos.all()])
    
    @property
    def apto_pescetarianos(self):
        return all([alimento.apto_pescetarianos for alimento in self.alimentos.all()])
    
    @property
    def carne(self):
        return any([alimento.carne for alimento in self.alimentos.all()])
    
    @property
    def verdura(self):
        return any([alimento.verdura for alimento in self.alimentos.all()])
    
    @property
    def pescado_marisco(self):
        return any([alimento.pescado_marisco for alimento in self.alimentos.all()])
    
    @property
    def enlatado_conserva(self):
        return any([alimento.enlatado_conserva for alimento in self.alimentos.all()])
    
    @property
    def cereal(self):
        return any([alimento.cereal for alimento in self.alimentos.all()])
    
    @property
    def pasta_arroz(self):
        return any([alimento.pasta_arroz for alimento in self.alimentos.all()])
    
    @property
    def lacteo_yogur_queso(self):
        return any([alimento.lacteo_yogur_queso for alimento in self.alimentos.all()])
    
    @property
    def fruta(self):
        return any([alimento.fruta for alimento in self.alimentos.all()])
    
    @property
    def fruto_seco(self):
        return any([alimento.fruto_seco for alimento in self.alimentos.all()])
    
    @property
    def legumbre(self):
        return any([alimento.legumbre for alimento in self.alimentos.all()])
    
    @property
    def salsa_condimento(self):
        return any([alimento.salsa_condimento for alimento in self.alimentos.all()])
    
    @property
    def fiambre(self):
        return any([alimento.fiambre for alimento in self.alimentos.all()])
    
    @property
    def pan_panMolde_tostada(self):
        return any([alimento.pan_panMolde_tostada for alimento in self.alimentos.all()])
    
    @property
    def huevo(self):
        return any([alimento.huevo for alimento in self.alimentos.all()])
    
    @property
    def suplemento_bebida_especial(self):
        return any([alimento.suplemento_bebida_especial for alimento in self.alimentos.all()])
    
    @property
    def tuberculo(self):
        return any([alimento.tuberculo for alimento in self.alimentos.all()])
    
    @property
    def otros(self):
        return any([alimento.otros for alimento in self.alimentos.all()])
    
class PlatoVariable(models.Model):
    plato_base = models.ForeignKey(PlatoBase, on_delete=models.CASCADE, null=True, blank=True)
    alimentos_variables = models.ManyToManyField(AlimentoVariable)
    
    @property
    def kcal(self):
        return sum([alimento.kcal for alimento in self.alimentos_variables.all()])
    
    @property
    def proteina(self):
        return sum([alimento.proteina for alimento in self.alimentos_variables.all()])
    
    @property
    def hc(self):
        return sum([alimento.hc for alimento in self.alimentos_variables.all()])
    
    @property
    def azucar(self):
        return sum([alimento.azucar for alimento in self.alimentos_variables.all()])
    
    @property
    def fibra(self):
        return sum([alimento.fibra for alimento in self.alimentos_variables.all()])
    
    @property
    def grasa(self):
        return sum([alimento.grasa for alimento in self.alimentos_variables.all()])
    
    @property
    def grasa_sat(self):
        return sum([alimento.grasa_sat for alimento in self.alimentos_variables.all()])
    
    @property
    def apto_celiacos(self):
        return all([alimento.apto_celiacos for alimento in self.alimentos_variables.all()])
    
    @property
    def apto_lactosa(self):
        return all([alimento.apto_lactosa for alimento in self.alimentos_variables.all()])
    
    @property
    def apto_veganos(self):
        return all([alimento.apto_veganos for alimento in self.alimentos_variables.all()])
    
    @property
    def apto_vegetarianos(self):
        return all([alimento.apto_vegetarianos for alimento in self.alimentos_variables.all()])
    
    @property
    def apto_pescetarianos(self):
        return all([alimento.apto_pescetarianos for alimento in self.alimentos_variables.all()])
    
    @property
    def carne(self):
        return any([alimento.carne for alimento in self.alimentos_variables.all()])
    
    @property
    def verdura(self):
        return any([alimento.verdura for alimento in self.alimentos_variables.all()])
    
    @property
    def pescado_marisco(self):
        return any([alimento.pescado_marisco for alimento in self.alimentos_variables.all()])
    
    @property
    def enlatado_conserva(self):
        return any([alimento.enlatado_conserva for alimento in self.alimentos_variables.all()])
    
    @property
    def cereal(self):
        return any([alimento.cereal for alimento in self.alimentos_variables.all()])
    
    @property
    def pasta_arroz(self):
        return any([alimento.pasta_arroz for alimento in self.alimentos_variables.all()])
    
    @property
    def lacteo_yogur_queso(self):
        return any([alimento.lacteo_yogur_queso for alimento in self.alimentos_variables.all()])
    
    @property
    def fruta(self):
        return any([alimento.fruta for alimento in self.alimentos_variables.all()])
    
    @property
    def fruto_seco(self):
        return any([alimento.fruto_seco for alimento in self.alimentos_variables.all()])
    
    @property
    def legumbre(self):
        return any([alimento.legumbre for alimento in self.alimentos_variables.all()])
    
    @property
    def salsa_condimento(self):
        return any([alimento.salsa_condimento for alimento in self.alimentos_variables.all()])
    
    @property
    def fiambre(self):
        return any([alimento.fiambre for alimento in self.alimentos_variables.all()])
    
    @property
    def pan_panMolde_tostada(self):
        return any([alimento.pan_panMolde_tostada for alimento in self.alimentos_variables.all()])
    
    @property
    def huevo(self):
        return any([alimento.huevo for alimento in self.alimentos_variables.all()])
    
    @property
    def suplemento_bebida_especial(self):
        return any([alimento.suplemento_bebida_especial for alimento in self.alimentos_variables.all()])
    
    @property
    def tuberculo(self):
        return any([alimento.tuberculo for alimento in self.alimentos_variables.all()])
    
    @property
    def otros(self):
        return any([alimento.otros for alimento in self.alimentos_variables.all()])
    
    def __str__(self):
        return f'{self.plato_base.name} - Variable'

class ComidaBase(models.Model):
    name = models.CharField(max_length=100)
    platos = models.ManyToManyField(PlatoVariable)
    
    @property
    def kcal(self):
        return sum([plato.kcal for plato in self.platos_variables.all()])
    
    @property
    def proteina(self):
        return sum([plato.proteina for plato in self.platos_variables.all()])
    
    @property
    def hc(self):
        return sum([plato.hc for plato in self.platos_variables.all()])
    
    @property
    def azucar(self):
        return sum([plato.azucar for plato in self.platos_variables.all()])
    
    @property
    def fibra(self):
        return sum([plato.fibra for plato in self.platos_variables.all()])
    
    @property
    def grasa(self):
        return sum([plato.grasa for plato in self.platos_variables.all()])
    
    @property
    def grasa_sat(self):
        return sum([plato.grasa_sat for plato in self.platos_variables.all()])
    
    @property
    def apto_celiacos(self):
        return all([plato.apto_celiacos for plato in self.platos_variables.all()])
    
    @property
    def apto_lactosa(self):
        return all([plato.apto_lactosa for plato in self.platos_variables.all()])
    
    @property
    def apto_veganos(self):
        return all([plato.apto_veganos for plato in self.platos_variables.all()])
    
    @property
    def apto_vegetarianos(self):
        return all([plato.apto_vegetarianos for plato in self.platos_variables.all()])
    
    @property
    def apto_pescetarianos(self):
        return all([plato.apto_pescetarianos for plato in self.platos_variables.all()])
    
    @property
    def carne(self):
        return any([plato.carne for plato in self.platos_variables.all()])
    
    @property
    def verdura(self):
        return any([plato.verdura for plato in self.platos_variables.all()])
    
    @property
    def pescado_marisco(self):
        return any([plato.pescado_marisco for plato in self.platos_variables.all()])
    
    @property
    def enlatado_conserva(self):
        return any([plato.enlatado_conserva for plato in self.platos_variables.all()])
    
    @property
    def cereal(self):
        return any([plato.cereal for plato in self.platos_variables.all()])
    
    @property
    def pasta_arroz(self):
        return any([plato.pasta_arroz for plato in self.platos_variables.all()])
    
    @property
    def lacteo_yogur_queso(self):
        return any([plato.lacteo_yogur_queso for plato in self.platos_variables.all()])
    
    @property
    def fruta(self):
        return any([plato.fruta for plato in self.platos_variables.all()])
    
    @property
    def fruto_seco(self):
        return any([plato.fruto_seco for plato in self.platos_variables.all()])
    
    @property
    def legumbre(self):
        return any([plato.legumbre for plato in self.platos_variables.all()])
    
    @property
    def salsa_condimento(self):
        return any([plato.salsa_condimento for plato in self.platos_variables.all()])
    
    @property
    def fiambre(self):
        return any([plato.fiambre for plato in self.platos_variables.all()])
    
    @property
    def pan_panMolde_tostada(self):
        return any([plato.pan_panMolde_tostada for plato in self.platos_variables.all()])
    
    @property
    def huevo(self):
        return any([plato.huevo for plato in self.platos_variables.all()])
    
    @property
    def suplemento_bebida_especial(self):
        return any([plato.suplemento_bebida_especial for plato in self.platos_variables.all()])
    
    @property
    def tuberculo(self):
        return any([plato.tuberculo for plato in self.platos_variables.all()])
    
    @property
    def otros(self):
        return any([plato.otros for plato in self.platos_variables.all()])
    
    def __str__(self):
        return f'{self.name}'
    
class ComidaVariable(models.Model):
    comida_base = models.ForeignKey(ComidaBase, on_delete=models.CASCADE, null=True, blank=True)
    platos_variables = models.ManyToManyField(PlatoVariable)
    
    @property
    def kcal(self):
        return sum([plato.kcal for plato in self.platos_variables.all()])
    
    @property
    def proteina(self):
        return sum([plato.proteina for plato in self.platos_variables.all()])
    
    @property
    def hc(self):
        return sum([plato.hc for plato in self.platos_variables.all()])
    
    @property
    def azucar(self):
        return sum([plato.azucar for plato in self.platos_variables.all()])
    
    @property
    def fibra(self):
        return sum([plato.fibra for plato in self.platos_variables.all()])
    
    @property
    def grasa(self):
        return sum([plato.grasa for plato in self.platos_variables.all()])
    
    @property
    def grasa_sat(self):
        return sum([plato.grasa_sat for plato in self.platos_variables.all()])
    
    @property
    def apto_celiacos(self):
        return all([plato.apto_celiacos for plato in self.platos_variables.all()])
    
    @property
    def apto_lactosa(self):
        return all([plato.apto_lactosa for plato in self.platos_variables.all()])
    
    @property
    def apto_veganos(self):
        return all([plato.apto_veganos for plato in self.platos_variables.all()])
    
    @property
    def apto_vegetarianos(self):
        return all([plato.apto_vegetarianos for plato in self.platos_variables.all()])
    
    @property
    def apto_pescetarianos(self):
        return all([plato.apto_pescetarianos for plato in self.platos_variables.all()])
    
    @property
    def carne(self):
        return any([plato.carne for plato in self.platos_variables.all()])
    
    @property
    def verdura(self):
        return any([plato.verdura for plato in self.platos_variables.all()])
    
    @property
    def pescado_marisco(self):
        return any([plato.pescado_marisco for plato in self.platos_variables.all()])
    
    @property
    def enlatado_conserva(self):
        return any([plato.enlatado_conserva for plato in self.platos_variables.all()])
    
    @property
    def cereal(self):
        return any([plato.cereal for plato in self.platos_variables.all()])
    
    @property
    def pasta_arroz(self):
        return any([plato.pasta_arroz for plato in self.platos_variables.all()])
    
    @property
    def lacteo_yogur_queso(self):
        return any([plato.lacteo_yogur_queso for plato in self.platos_variables.all()])
    
    @property
    def fruta(self):
        return any([plato.fruta for plato in self.platos_variables.all()])
    
    @property
    def fruto_seco(self):
        return any([plato.fruto_seco for plato in self.platos_variables.all()])
    
    @property
    def legumbre(self):
        return any([plato.legumbre for plato in self.platos_variables.all()])
    
    @property
    def salsa_condimento(self):
        return any([plato.salsa_condimento for plato in self.platos_variables.all()])
    
    @property
    def fiambre(self):
        return any([plato.fiambre for plato in self.platos_variables.all()])
    
    @property
    def pan_panMolde_tostada(self):
        return any([plato.pan_panMolde_tostada for plato in self.platos_variables.all()])
    
    @property
    def huevo(self):
        return any([plato.huevo for plato in self.platos_variables.all()])
    
    @property
    def suplemento_bebida_especial(self):
        return any([plato.suplemento_bebida_especial for plato in self.platos_variables.all()])
    
    @property
    def tuberculo(self):
        return any([plato.tuberculo for plato in self.platos_variables.all()])
    
    @property
    def otros(self):
        return any([plato.otros for plato in self.platos_variables.all()])
    
    def __str__(self):
        return f'{self.comida_base.name} - Variable'

class OpcionBase(models.Model):
    name = models.CharField(max_length=100)
    desayuno = models.ForeignKey(ComidaVariable, on_delete=models.CASCADE, null=True, blank=True, related_name='base_desayuno')
    almuerzo = models.ForeignKey(ComidaVariable, on_delete=models.CASCADE, null=True, blank=True, related_name='base_almuerzo')
    comida = models.ForeignKey(ComidaVariable, on_delete=models.CASCADE, null=True, blank=True, related_name='base_comida')
    merienda = models.ForeignKey(ComidaVariable, on_delete=models.CASCADE, null=True, blank=True, related_name='base_merienda')
    cena = models.ForeignKey(ComidaVariable, on_delete=models.CASCADE, null=True, blank=True, related_name='base_cena')

    @property
    def kcal(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return sum([comida.kcal for comida in comidas if comida])

    @property
    def proteina(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return sum([comida.proteina for comida in comidas if comida])

    @property
    def hc(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return sum([comida.hc for comida in comidas if comida])

    @property
    def azucar(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return sum([comida.azucar for comida in comidas if comida])

    @property
    def fibra(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return sum([comida.fibra for comida in comidas if comida])

    @property
    def grasa(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return sum([comida.grasa for comida in comidas if comida])

    @property
    def grasa_sat(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return sum([comida.grasa_sat for comida in comidas if comida])
    
    @property
    def apto_celiacos(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return all([comida.apto_celiacos for comida in comidas if comida])
    
    @property
    def apto_lactosa(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return all([comida.apto_lactosa for comida in comidas if comida])
    
    @property
    def apto_veganos(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return all([comida.apto_veganos for comida in comidas if comida])
    
    @property
    def apto_vegetarianos(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return all([comida.apto_vegetarianos for comida in comidas if comida])
    
    @property
    def apto_pescetarianos(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return all([comida.apto_pescetarianos for comida in comidas if comida])
    
    @property
    def carne(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return any([comida.carne for comida in comidas if comida])
    
    @property
    def verdura(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return any([comida.verdura for comida in comidas if comida])
    
    @property
    def pescado_marisco(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return any([comida.pescado_marisco for comida in comidas if comida])
    
    @property
    def enlatado_conserva(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return any([comida.enlatado_conserva for comida in comidas if comida])
    
    @property
    def cereal(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return any([comida.cereal for comida in comidas if comida])
    
    @property
    def pasta_arroz(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return any([comida.pasta_arroz for comida in comidas if comida])
    
    @property
    def lacteo_yogur_queso(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return any([comida.lacteo_yogur_queso for comida in comidas if comida])
    
    @property
    def fruta(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return any([comida.fruta for comida in comidas if comida])
    
    @property
    def fruto_seco(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena] 
        return any([comida.fruto_seco for comida in comidas if comida])
    
    @property
    def legumbre(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena] 
        return any([comida.legumbre for comida in comidas if comida])
    
    @property
    def salsa_condimento(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena] 
        return any([comida.salsa_condimento for comida in comidas if comida])
    
    @property
    def fiambre(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena] 
        return any([comida.fiambre for comida in comidas if comida])
    
    @property
    def pan_panMolde_tostada(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena] 
        return any([comida.pan_panMolde_tostada for comida in comidas if comida])
    
    @property
    def huevo(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena] 
        return any([comida.huevo for comida in comidas if comida])
    
    @property
    def suplemento_bebida_especial(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena] 
        return any([comida.suplemento_bebida_especial for comida in comidas if comida])
    
    @property
    def tuberculo(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return any([comida.tuberculo for comida in comidas if comida])
    
    @property
    def otros(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena] 
        return any([comida.otros for comida in comidas if comida])
    
    def __str__(self):
        return f'{self.name}'
    
class OpcionVariable(models.Model):
    opcion = models.ForeignKey(OpcionBase, on_delete=models.CASCADE, null=True, blank=True)
    desayuno = models.ForeignKey(ComidaVariable, on_delete=models.CASCADE, null=True, blank=True, related_name='variable_desayuno')
    almuerzo = models.ForeignKey(ComidaVariable, on_delete=models.CASCADE, null=True, blank=True, related_name='variable_almuerzo')
    comida = models.ForeignKey(ComidaVariable, on_delete=models.CASCADE, null=True, blank=True, related_name='variable_comida')
    merienda = models.ForeignKey(ComidaVariable, on_delete=models.CASCADE, null=True, blank=True, related_name='variable_merienda')
    cena = models.ForeignKey(ComidaVariable, on_delete=models.CASCADE, null=True, blank=True, related_name='variable_cena')

    @property
    def kcal(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return sum([comida.kcal for comida in comidas if comida])

    @property
    def proteina(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return sum([comida.proteina for comida in comidas if comida])

    @property
    def hc(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return sum([comida.hc for comida in comidas if comida])

    @property
    def azucar(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return sum([comida.azucar for comida in comidas if comida])

    @property
    def fibra(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return sum([comida.fibra for comida in comidas if comida])

    @property
    def grasa(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return sum([comida.grasa for comida in comidas if comida])

    @property
    def grasa_sat(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return sum([comida.grasa_sat for comida in comidas if comida])
    
    @property
    def apto_celiacos(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return all([comida.apto_celiacos for comida in comidas if comida])
    
    @property
    def apto_lactosa(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return all([comida.apto_lactosa for comida in comidas if comida])
    
    @property
    def apto_veganos(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return all([comida.apto_veganos for comida in comidas if comida])
    
    @property
    def apto_vegetarianos(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return all([comida.apto_vegetarianos for comida in comidas if comida])
    
    @property
    def apto_pescetarianos(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return all([comida.apto_pescetarianos for comida in comidas if comida])
    
    @property
    def carne(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return any([comida.carne for comida in comidas if comida])
    
    @property
    def verdura(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return any([comida.verdura for comida in comidas if comida])
    
    @property
    def pescado_marisco(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return any([comida.pescado_marisco for comida in comidas if comida])
    
    @property
    def enlatado_conserva(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return any([comida.enlatado_conserva for comida in comidas if comida])
    
    @property
    def cereal(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return any([comida.cereal for comida in comidas if comida])
    
    @property
    def pasta_arroz(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return any([comida.pasta_arroz for comida in comidas if comida])
    
    @property
    def lacteo_yogur_queso(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return any([comida.lacteo_yogur_queso for comida in comidas if comida])
    
    @property
    def fruta(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return any([comida.fruta for comida in comidas if comida])
    
    @property
    def fruto_seco(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena] 
        return any([comida.fruto_seco for comida in comidas if comida])
    
    @property
    def legumbre(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena] 
        return any([comida.legumbre for comida in comidas if comida])
    
    @property
    def salsa_condimento(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena] 
        return any([comida.salsa_condimento for comida in comidas if comida])
    
    @property
    def fiambre(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena] 
        return any([comida.fiambre for comida in comidas if comida])
    
    @property
    def pan_panMolde_tostada(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena] 
        return any([comida.pan_panMolde_tostada for comida in comidas if comida])
    
    @property
    def huevo(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena] 
        return any([comida.huevo for comida in comidas if comida])
    
    @property
    def suplemento_bebida_especial(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena] 
        return any([comida.suplemento_bebida_especial for comida in comidas if comida])
    
    @property
    def tuberculo(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena]
        return any([comida.tuberculo for comida in comidas if comida])
    
    @property
    def otros(self):
        comidas = [self.desayuno, self.almuerzo, self.comida, self.merienda, self.cena] 
        return any([comida.otros for comida in comidas if comida])
    
    def __str__(self):
        return f'{self.opcion.name}'
    
class PlanBase(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    opcion1 = models.ForeignKey(OpcionVariable, on_delete=models.CASCADE, null=True, blank=True, related_name='base_opcion1')
    opcion2 = models.ForeignKey(OpcionVariable, on_delete=models.CASCADE, null=True, blank=True, related_name='base_opcion2')
    opcion3 = models.ForeignKey(OpcionVariable, on_delete=models.CASCADE, null=True, blank=True, related_name='base_opcion3')
    suplementos = models.TextField(null=True, blank=True)
    notas = models.TextField(null=True, blank=True)
    goal = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return self.name
    
class PlanVariable(models.Model):
    cliente = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, related_name='dietas')
    plan = models.ForeignKey(PlanBase, on_delete=models.CASCADE, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    opcion1 = models.ForeignKey(OpcionVariable, on_delete=models.CASCADE, null=True, blank=True, related_name='variable_opcion1')
    opcion2 = models.ForeignKey(OpcionVariable, on_delete=models.CASCADE, null=True, blank=True, related_name='variable_opcion2')
    opcion3 = models.ForeignKey(OpcionVariable, on_delete=models.CASCADE, null=True, blank=True, related_name='variable_opcion3')
    suplementos = models.TextField(null=True, blank=True)
    notas = models.TextField(null=True, blank=True)
    goal = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f'{self.cliente} - {self.plan}' 

from django.core.exceptions import ValidationError
class Calendario(models.Model):
    plan = models.ForeignKey(PlanVariable, on_delete=models.CASCADE, related_name='calendario')
    fecha = models.DateField()
    opcion = models.ForeignKey(OpcionVariable, on_delete=models.CASCADE, null=True, blank=True)
    cliente = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='calendario')

    class Meta:
        unique_together = ['plan', 'fecha']

    def __str__(self):
        return f'Calendario para {self.plan} - {self.fecha}'

    def clean(self):
        # Verifica si la instancia tiene un plan antes de realizar la validación
        if self.plan:
            if self.fecha < self.plan.start_date or self.fecha > self.plan.end_date:
                raise ValidationError('La fecha no está dentro del rango del plan')
        else:
            raise ValidationError('El plan no está establecido para esta instancia de Calendario.')