# Generated by Django 3.2.25 on 2024-12-04 11:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_playerscore_total_score'),
    ]

    operations = [
        migrations.AddField(
            model_name='playerscore',
            name='result',
            field=models.CharField(default='Unknown', max_length=10),
        ),
    ]
