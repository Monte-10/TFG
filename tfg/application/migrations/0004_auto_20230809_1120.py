# Generated by Django 3.2.1 on 2023-08-09 09:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0003_alter_customuser_gender'),
    ]

    operations = [
        migrations.CreateModel(
            name='MuscleGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='repetitions',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='sets',
        ),
        migrations.RemoveField(
            model_name='trainingexercise',
            name='order',
        ),
        migrations.AddField(
            model_name='trainingexercise',
            name='repetitions',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='trainingexercise',
            name='sets',
            field=models.IntegerField(default=0),
        ),
        migrations.RemoveField(
            model_name='training',
            name='muscle_groups',
        ),
        migrations.AddField(
            model_name='exercise',
            name='muscle_groups',
            field=models.ManyToManyField(to='application.MuscleGroup'),
        ),
        migrations.AddField(
            model_name='training',
            name='muscle_groups',
            field=models.ManyToManyField(to='application.MuscleGroup'),
        ),
    ]
