# Generated by Django 3.2.25 on 2024-12-04 14:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_auto_20241204_1430'),
    ]

    operations = [
        migrations.AddField(
            model_name='playerscore',
            name='total_score',
            field=models.IntegerField(default=0),
        ),
    ]
