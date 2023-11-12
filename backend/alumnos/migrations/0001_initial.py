# Generated by Django 4.2.3 on 2023-08-22 20:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('examenes', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Alumno',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('apellido', models.CharField(max_length=100)),
                ('dni', models.IntegerField()),
                ('año', models.CharField(max_length=1)),
                ('curso', models.CharField(max_length=1)),
            ],
        ),
        migrations.CreateModel(
            name='AlumnoExamen',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nota', models.DecimalField(decimal_places=2, max_digits=4)),
                ('alumno', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='alumno_examen', to='alumnos.alumno')),
                ('examen', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='alumno_examen', to='examenes.examen')),
            ],
        ),
        migrations.AddField(
            model_name='alumno',
            name='examen',
            field=models.ManyToManyField(related_name='alumno', through='alumnos.AlumnoExamen', to='examenes.examen'),
        ),
    ]
