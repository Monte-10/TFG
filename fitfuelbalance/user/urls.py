from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='login.html', next_page='profile'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
    path('regularsignup/', views.RegularUserSingUpView.as_view(), name='regularsignup'),
    path('trainersignup/', views.TrainerSingUpView.as_view(), name='trainersignup'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
]
