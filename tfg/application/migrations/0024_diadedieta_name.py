# Generated by Django 3.2.1 on 2023-09-08 11:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0023_diadedieta'),
    ]

    operations = [
        migrations.AddField(
            model_name='diadedieta',
            name='name',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
    ]
