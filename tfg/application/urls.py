# application/urls.py
from django.urls import path, re_path
from .views import (CustomUserListView, CustomUserDetailView, CustomUserCreateView, CustomUserUpdateView, CustomUserDeleteView)
from .views import (ExerciseListView, ExerciseDetailView, ExerciseCreateView, ExerciseUpdateView, ExerciseDeleteView)
from .views import (TrainingListView, TrainingDetailView, TrainingCreateView, TrainingUpdateView, TrainingDeleteView)
from .views import (ChallengeListView, ChallengeDetailView, ChallengeCreateView, ChallengeUpdateView, ChallengeDeleteView)
from .views import (ClientTrainingsListView)
from .views import (AlimentoListView, AlimentoDetailView, AlimentoCreateView, AlimentoUpdateView, AlimentoDeleteView)
from .views import (ComidaListView, ComidaDetailView, ComidaCreateView, ComidaUpdateView, ComidaDeleteView)
from .views import (DiaDeDietaListView, DiaDeDietaDetailView, DiaDeDietaCreateView, DiaDeDietaUpdateView, DiaDeDietaDeleteView)
from .views import home

urlpatterns = [
    re_path(r'^$', home, name='home'),
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
    path('diadedieta/', DiaDeDietaListView.as_view(), name='diaDeDieta_list'),
    path('diadedieta/<int:pk>/', DiaDeDietaDetailView.as_view(), name='diaDeDieta_detail'),
    path('diadedieta/create/', DiaDeDietaCreateView.as_view(), name='diaDeDieta_create'),
    path('diadedieta/update/<int:pk>/', DiaDeDietaUpdateView.as_view(), name='diaDeDieta_update'),
    path('diadedieta/delete/<int:pk>/', DiaDeDietaDeleteView.as_view(), name='diaDeDieta_delete'),
]