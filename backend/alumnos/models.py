import os
from django.conf import settings
from django.db import models


def user_pic_directory_path(instance, filename):
    pic = 'alumnos/{0}/pic.jpg'.format(str(instance).replace(" ", "_"))
    full_path = os.path.join(settings.MEDIA_ROOT, pic)

    if os.path.exists(full_path):
        os.remove(full_path)

    return pic


AÑO = (
    ("1°", "Primero"),
    ("2°", "Segundo"),
    ("3°", "Tercero"),
    ("4°", "Cuarto"),
    ("5°", "Quinto"),
)

CURSO = (
    ("A", "A"),
    ("B", "B"),
    ("C", "C"),
)


class Alumno(models.Model):
    user = models.OneToOneField("users.User", on_delete=models.CASCADE, related_name='alumno')
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    dni = models.IntegerField()
    curso = models.CharField(choices=CURSO, max_length=50)
    año = models.CharField(choices=AÑO, max_length=50)
    pic = models.ImageField(upload_to=user_pic_directory_path, blank=True, null=True)
    examen = models.ManyToManyField(
        "examenes.Examen", related_name="alumno", through="AlumnoExamen"
    )

    def __str__(self):
        return self.nombre + " " + self.apellido


class AlumnoExamen(models.Model):
    alumno = models.ForeignKey(
        Alumno, related_name="alumno_examen", on_delete=models.CASCADE
    )
    examen = models.ForeignKey(
        "examenes.Examen", related_name="alumno_examen", on_delete=models.CASCADE
    )
    nota = models.DecimalField(max_digits=3, decimal_places=1)

    def __str__(self):
        return self.alumno.nombre + " " + self.examen.title