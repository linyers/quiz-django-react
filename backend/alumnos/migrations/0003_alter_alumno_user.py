# Generated by Django 4.2.7 on 2023-11-20 00:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('alumnos', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='alumno',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='alumno', to=settings.AUTH_USER_MODEL),
        ),
    ]
