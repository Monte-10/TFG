# Generated by Django 4.2.6 on 2024-01-23 09:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_regularuser_trainer_remove_customuser_user_type_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='trainer',
            name='gym',
        ),
    ]
