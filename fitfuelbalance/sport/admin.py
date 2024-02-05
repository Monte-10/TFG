from django.contrib import admin
from .models import Ejercicio, Entrenamiento, EntrenamientoEjercicio

@admin.register(Ejercicio)
class EjercicioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'tipo', 'descripcion')
    search_fields = ('nombre', 'tipo')

@admin.register(Entrenamiento)
class EntrenamientoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'fecha', 'usuario')
    search_fields = ('nombre', 'usuario__username')
    list_filter = ('fecha',)

@admin.register(EntrenamientoEjercicio)
class EntrenamientoEjercicioAdmin(admin.ModelAdmin):
    list_display = ('entrenamiento', 'ejercicio', 'repeticiones', 'series', 'peso')
    search_fields = ('entrenamiento__nombre', 'ejercicio__nombre')
