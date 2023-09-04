# Generated by Django 4.2.4 on 2023-08-30 10:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0007_alter_customuser_role'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='training',
            name='user',
        ),
        migrations.AddField(
            model_name='customuser',
            name='entrenador',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='clientes', to='application.customuser'),
        ),
        migrations.AddField(
            model_name='training',
            name='cliente',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='entrenamientos', to='application.customuser'),
        ),
    ]