# Generated by Django 4.2.4 on 2023-08-30 10:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0008_remove_training_user_customuser_entrenador_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='age',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='height',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='weight',
            field=models.FloatField(blank=True, null=True),
        ),
    ]