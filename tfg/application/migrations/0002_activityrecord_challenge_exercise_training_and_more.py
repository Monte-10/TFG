# Generated by Django 4.2.4 on 2023-08-05 18:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ActivityRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('activity_type', models.CharField(max_length=50)),
                ('duration', models.DurationField()),
                ('distance', models.FloatField()),
                ('calories_burned', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Challenge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('goal', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Exercise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('video_url', models.URLField()),
                ('description', models.TextField()),
                ('muscle_image', models.ImageField(upload_to='muscles/')),
                ('sets', models.IntegerField()),
                ('repetitions', models.IntegerField()),
                ('duration', models.DurationField()),
                ('timer', models.DurationField()),
            ],
        ),
        migrations.CreateModel(
            name='Training',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('approximate_duration', models.DurationField()),
                ('muscle_groups', models.TextField()),
                ('note', models.TextField()),
                ('date', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='TrainingExercise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.IntegerField()),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='application.exercise')),
                ('training', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='application.training')),
            ],
        ),
        migrations.CreateModel(
            name='UserChallenge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('completed_date', models.DateField()),
                ('status', models.CharField(max_length=50)),
                ('challenge', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='application.challenge')),
            ],
        ),
        migrations.RemoveField(
            model_name='entrenamiento',
            name='ejercicios',
        ),
        migrations.RemoveField(
            model_name='entrenamiento',
            name='usuario',
        ),
        migrations.RemoveField(
            model_name='entrenamientoejercicio',
            name='ejercicio',
        ),
        migrations.RemoveField(
            model_name='entrenamientoejercicio',
            name='entrenamiento',
        ),
        migrations.RemoveField(
            model_name='registroactividad',
            name='usuario',
        ),
        migrations.RemoveField(
            model_name='usuariodesafio',
            name='desafio',
        ),
        migrations.RemoveField(
            model_name='usuariodesafio',
            name='usuario',
        ),
        migrations.RenameField(
            model_name='customuser',
            old_name='edad',
            new_name='age',
        ),
        migrations.RenameField(
            model_name='customuser',
            old_name='tension_arterial',
            new_name='blood_pressure',
        ),
        migrations.RenameField(
            model_name='customuser',
            old_name='azucar_en_sangre',
            new_name='blood_sugar',
        ),
        migrations.RenameField(
            model_name='customuser',
            old_name='ingesta_calorías',
            new_name='calorie_intake',
        ),
        migrations.RenameField(
            model_name='customuser',
            old_name='consumo_agua_diario',
            new_name='daily_water_intake',
        ),
        migrations.RenameField(
            model_name='customuser',
            old_name='tipo_dieta',
            new_name='diet_type',
        ),
        migrations.RenameField(
            model_name='customuser',
            old_name='genero',
            new_name='gender',
        ),
        migrations.RenameField(
            model_name='customuser',
            old_name='objetivo',
            new_name='goal',
        ),
        migrations.RenameField(
            model_name='customuser',
            old_name='problemas_salud',
            new_name='health_issues',
        ),
        migrations.RenameField(
            model_name='customuser',
            old_name='altura',
            new_name='height',
        ),
        migrations.RenameField(
            model_name='customuser',
            old_name='medidas_caderas',
            new_name='hip_measurement',
        ),
        migrations.RenameField(
            model_name='customuser',
            old_name='estilo_vida',
            new_name='lifestyle',
        ),
        migrations.RenameField(
            model_name='customuser',
            old_name='otros_objetivos',
            new_name='other_goals',
        ),
        migrations.RenameField(
            model_name='customuser',
            old_name='medidas_cintura',
            new_name='waist_measurement',
        ),
        migrations.RenameField(
            model_name='customuser',
            old_name='peso',
            new_name='weight',
        ),
        migrations.DeleteModel(
            name='Desafío',
        ),
        migrations.DeleteModel(
            name='Ejercicio',
        ),
        migrations.DeleteModel(
            name='Entrenamiento',
        ),
        migrations.DeleteModel(
            name='EntrenamientoEjercicio',
        ),
        migrations.DeleteModel(
            name='RegistroActividad',
        ),
        migrations.DeleteModel(
            name='UsuarioDesafio',
        ),
        migrations.AddField(
            model_name='userchallenge',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='application.customuser'),
        ),
        migrations.AddField(
            model_name='training',
            name='exercises',
            field=models.ManyToManyField(through='application.TrainingExercise', to='application.exercise'),
        ),
        migrations.AddField(
            model_name='training',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='application.customuser'),
        ),
        migrations.AddField(
            model_name='challenge',
            name='participants',
            field=models.ManyToManyField(through='application.UserChallenge', to='application.customuser'),
        ),
        migrations.AddField(
            model_name='activityrecord',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='application.customuser'),
        ),
    ]
