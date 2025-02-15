# Generated by Django 3.2.25 on 2024-12-01 19:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_profile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='playerscore',
            name='player_name',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='playerscore',
            name='score',
            field=models.IntegerField(default=0),
        ),
    ]
