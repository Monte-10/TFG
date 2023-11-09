# application/urls.py
from django.urls import path, re_path
from .views import (CustomUserListView, CustomUserDetailView, CustomUserCreateView, CustomUserUpdateView, CustomUserDeleteView)
from .views import (ExerciseListView, ExerciseDetailView, ExerciseCreateView, ExerciseUpdateView, ExerciseDeleteView)
from .views import (TrainingListView, TrainingDetailView, TrainingCreateView, TrainingUpdateView, TrainingDeleteView)
from .views import (ChallengeListView, ChallengeDetailView, ChallengeCreateView, ChallengeUpdateView, ChallengeDeleteView)
from .views import (ClientTrainingsListView)
from .views import (AlimentoListView, AlimentoDetailView, AlimentoCreateView, AlimentoUpdateView, AlimentoDeleteView)
from .views import (ComidaListView, ComidaDetailView, ComidaCreateView, ComidaUpdateView, ComidaDeleteView)
from .views import (OpcionListView, OpcionDetailView, OpcionCreateView, OpcionUpdateView, OpcionDeleteView)
from .views import (PlanListView, PlanDetailView, PlanCreateView, PlanUpdateView, PlanDeleteView)
#from .views import (CalendarioCreateView)
from .views import home, crear_calendario, alimentacion, view_assigned_clients, inicio, perfil

urlpatterns = [
    re_path(r'^$', home, name='home'),
    path('inicio/', inicio, name='inicio'),
    path('perfil/', perfil, name='perfil'),
    path('customuser/', CustomUserListView.as_view(), name='customuser_list'),
    path('user/<int:pk>/', CustomUserDetailView.as_view(), name='customuser_detail'),
    #path('user/create/', CustomUserCreateView.as_view(), name='customuser_create'),
    path('customuser/update/<int:pk>/', CustomUserUpdateView.as_view(), name='customuser_update'),
    path('customuser/delete/<int:pk>/', CustomUserDeleteView.as_view(), name='customuser_delete'),
    path('register/', CustomUserCreateView.as_view(), name='register'),
]

urlpatterns += [
    path('exercise/', ExerciseListView.as_view(), name='exercise_list'),
    path('exercise/<int:pk>/', ExerciseDetailView.as_view(), name='exercise_detail'),
    path('exercise/create/', ExerciseCreateView.as_view(), name='exercise_create'),
    path('exercise/update/<int:pk>/', ExerciseUpdateView.as_view(), name='exercise_update'),
    path('exercise/delete/<int:pk>/', ExerciseDeleteView.as_view(), name='exercise_delete'),
]

urlpatterns += [
    path('training/', TrainingListView.as_view(), name='training_list'),
    path('training/<int:pk>/', TrainingDetailView.as_view(), name='training_detail'),
    path('training/create/', TrainingCreateView.as_view(), name='training_create'),
    path('training/update/<int:pk>/', TrainingUpdateView.as_view(), name='training_update'),
    path('training/delete/<int:pk>/', TrainingDeleteView.as_view(), name='training_delete'),
]

urlpatterns += [
    path('challenge/', ChallengeListView.as_view(), name='challenge_list'),
    path('challenge/<int:pk>/', ChallengeDetailView.as_view(), name='challenge_detail'),
    path('challenge/create/', ChallengeCreateView.as_view(), name='challenge_create'),
    path('challenge/update/<int:pk>/', ChallengeUpdateView.as_view(), name='challenge_update'),
    path('challenge/delete/<int:pk>/', ChallengeDeleteView.as_view(), name='challenge_delete'),
]

urlpatterns += [
    path('my_trainings/', ClientTrainingsListView.as_view(), name='my_trainings'),
]

urlpatterns += [
    path('alimento/', AlimentoListView.as_view(), name='alimento_list'),
    path('alimento/<int:pk>/', AlimentoDetailView.as_view(), name='alimento_detail'),
    path('alimento/create/', AlimentoCreateView.as_view(), name='alimento_create'),
    path('alimento/update/<int:pk>/', AlimentoUpdateView.as_view(), name='alimento_update'),
    path('alimento/delete/<int:pk>/', AlimentoDeleteView.as_view(), name='alimento_delete'),
]

urlpatterns += [
    path('comida/', ComidaListView.as_view(), name='comida_list'),
    path('comida/<int:pk>/', ComidaDetailView.as_view(), name='comida_detail'),
    path('comida/create/', ComidaCreateView.as_view(), name='comida_create'),
    path('comida/update/<int:pk>/', ComidaUpdateView.as_view(), name='comida_update'),
    path('comida/delete/<int:pk>/', ComidaDeleteView.as_view(), name='comida_delete'),
]

urlpatterns += [
    path('opcion/', OpcionListView.as_view(), name='opcion_list'),
    path('opcion/<int:pk>/', OpcionDetailView.as_view(), name='opcion_detail'),
    path('opcion/create/', OpcionCreateView.as_view(), name='opcion_create'),
    path('opcion/update/<int:pk>/', OpcionUpdateView.as_view(), name='opcion_update'),
    path('opcion/delete/<int:pk>/', OpcionDeleteView.as_view(), name='opcion_delete'),
]

urlpatterns += [
    path('plan/', PlanListView.as_view(), name='plan_list'),
    path('plan/<int:pk>/', PlanDetailView.as_view(), name='plan_detail'),
    path('plan/create/', PlanCreateView.as_view(), name='plan_create'),
    #path('plan/create/', crear_plan_con_calendario, name='plan_create'),
    path('plan/update/<int:pk>/', PlanUpdateView.as_view(), name='plan_update'),
    path('plan/delete/<int:pk>/', PlanDeleteView.as_view(), name='plan_delete'),
]

urlpatterns += [
    path('calendario/create/<int:plan_id>', crear_calendario, name='calendario_create'),
    path('alimentacion/', alimentacion, name='alimentacion'),
    path('clientes_entrenador/', view_assigned_clients, name='clientes_entrenador'),
]

from .views import request_trainer_view, view_requests_view, accept_request, reject_request

urlpatterns += [
    path('solicitar_entrenador/', request_trainer_view, name='request_trainer'),
    path('ver_solicitudes/', view_requests_view, name='view_requests'),
    path('ver_solicitudes/aceptar/<int:request_id>/', accept_request, name='accept_request'),
    path('ver_solicitudes/rechazar/<int:request_id>/', reject_request, name='reject_request'),
]


from . import views
from .views import AlimentoBaseDeleteView

urlpatterns += [
    path('list_alimento_base/', views.list_alimento_base, name='list_alimento_base'),
    path('add_alimento_base/', views.add_edit_alimento_base, name='add_alimento_base'),
    path('edit_alimento_base/<int:alimento_id>/', views.add_edit_alimento_base, name='edit_alimento_base'),
    path('add_alimento_to_comida/', views.add_alimento_to_comida, name='add_alimento_to_comida'),
    path('alimento_base/delete/<int:pk>/', AlimentoBaseDeleteView.as_view(), name='delete_alimento_base'),
]

urlpatterns += [
    path('plato/', PlatoListView.as_view(), name='plato_list'),
    path('plato/<int:pk>/', PlatoDetailView.as_view(), name='plato_detail'),
    path('plato/create/', PlatoCreateView.as_view(), name='plato_create'),
    path('plato/update/<int:pk>/', PlatoUpdateView.as_view(), name='plato_update'),
    path('plato/delete/<int:pk>/', PlatoDeleteView.as_view(), name='plato_delete'),
    path('list_plato_base/', views.list_plato_base, name='list_plato_base'),
    path('add_plato_base/', views.add_edit_plato_base, name='add_plato_base'),
    path('edit_plato_base/<int:plato_id>/', views.add_edit_plato_base, name='edit_plato_base'),
    path('plato_base/delete/<int:pk>/', views.PlatoBaseDeleteView.as_view(), name='delete_opcion_base'),
]

urlpatterns += [
    path('list_comida_base/', views.list_comida, name='list_comida_base'),
    path('add_comida_base/', views.add_edit_comida, name='add_comida_base'),
    path('edit_comida_base/<int:comida_id>/', views.add_edit_comida, name='edit_comida_base'),
    path('comida_base/delete/<int:pk>/', views.ComidaDeleteView.as_view(), name='delete_comida_base'),
]