# Generated by Django 4.2.3 on 2023-09-20 17:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('alumnos', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='alumnoexamen',
            name='nota',
            field=models.DecimalField(decimal_places=1, max_digits=2),
        ),
    ]