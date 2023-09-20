# Generated by Django 3.2.1 on 2023-09-15 08:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0029_auto_20230914_1308'),
    ]

    operations = [
        migrations.CreateModel(
            name='Calendario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateField()),
                ('opcion', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='application.opcion')),
                ('plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='calendario', to='application.plan')),
            ],
            options={
                'unique_together': {('plan', 'fecha')},
            },
        ),
    ]