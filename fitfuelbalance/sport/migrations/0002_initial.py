# Generated by Django 4.2.6 on 2024-04-25 10:42

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('sport', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='training',
            name='trainer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trainer', to='user.trainer'),
        ),
        migrations.AddField(
            model_name='training',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user', to=settings.AUTH_USER_MODEL),
        ),
    ]
