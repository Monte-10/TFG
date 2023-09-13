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
    
    groups = models.ManyToManyField(Group, related_name='customuser_groups')
    user_permissions = models.ManyToManyField(Permission, related_name='customuser_permissions')
    
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
    health_issues = models.TextField(null=True, blank=True)
    blood_pressure = models.FloatField(null=True, blank=True)
    blood_sugar = models.FloatField(null=True, blank=True)
    daily_water_intake = models.FloatField(null=True, blank=True)
    diet_type = models.CharField(max_length=50, null=True, blank=True)
    calorie_intake = models.FloatField(null=True, blank=True)
    lifestyle = models.CharField(max_length=50, choices=LIFE_STYLE_CHOICES, null=True, blank=True)
    other_goals = models.TextField(null=True, blank=True)
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
    
    
# ----------  DIETA  ------------ #

class Alimento(models.Model):
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
    pescado_marisco_enlatado_conserva = models.BooleanField(default=False)
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

class Comida(models.Model):
    name = models.CharField(max_length=100)
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
    pescado_marisco_enlatado_conserva = models.BooleanField(default=False)
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
    alimentos = models.ManyToManyField(Alimento)
    
    def __str__(self):
        return self.name

class DiaDeDieta(models.Model):
    name = models.CharField(max_length=100)
    cliente = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, related_name='dias_de_dieta')
    desayuno = models.ForeignKey(Comida, on_delete=models.CASCADE, null=True, blank=True, related_name='desayuno')
    almuerzo = models.ForeignKey(Comida, on_delete=models.CASCADE, null=True, blank=True, related_name='almuerzo')
    comida = models.ForeignKey(Comida, on_delete=models.CASCADE, null=True, blank=True, related_name='comida')
    merienda = models.ForeignKey(Comida, on_delete=models.CASCADE, null=True, blank=True, related_name='merienda')
    cena = models.ForeignKey(Comida, on_delete=models.CASCADE, null=True, blank=True, related_name='cena')
    kcal = models.IntegerField(null=True, blank=True)
    proteina = models.FloatField(null=True, blank=True)
    hc = models.FloatField(null=True, blank=True)
    azucar = models.FloatField(null=True, blank=True)
    fibra = models.FloatField(null=True, blank=True)
    grasa = models.FloatField(null=True, blank=True)
    grasa_sat = models.FloatField(null=True, blank=True)
    apto_celiacos = models.BooleanField(default=False)
    apto_lactosa = models.BooleanField(default=False)
    apto_veganos = models.BooleanField(default=False)
    apto_vegetarianos = models.BooleanField(default=False)
    apto_pescetarianos = models.BooleanField(default=False)
    carne = models.BooleanField(default=False)
    verdura = models.BooleanField(default=False)
    pescado_marisco_enlatado_conserva = models.BooleanField(default=False)
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

class Dieta(models.Model):
    cliente = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, related_name='dietas')
    name = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    goal = models.TextField(null=True, blank=True)
    dias_de_dieta = models.ManyToManyField(DiaDeDieta, through='AsignacionDiaDeDieta', related_name='dietas')
    
    def __str__(self):
        return self.name

class AsignacionDiaDeDieta(models.Model):
    dieta = models.ForeignKey(Dieta, on_delete=models.CASCADE)
    dia_de_dieta = models.ForeignKey(DiaDeDieta, on_delete=models.CASCADE)
    fecha_asignacion = models.DateField()