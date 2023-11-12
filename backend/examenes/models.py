from django.db import models
from django.conf import settings
import os


def examen_img_path(instance, filename):
    image = f'examenes/{instance.title}.jpg'
    full_path = os.path.join(settings.MEDIA_ROOT, image)

    if os.path.exists(full_path):
        os.remove(full_path)

    return image


AÑO = (
    ('1°', '1°'),
    ('2°', '2°'),
    ('3°', '3°'),
    ('4°', '4°'),    
    ('5°', '5°'),  
)

CURSO = (
    ('A', 'A'),
    ('B', 'B'),
    ('C', 'C'),
)

MATERIAS = (
    ('historia', 'Historia'),
    ('etica', 'Etica'),
)

class Examen(models.Model):
    title = models.CharField(max_length=100)
    curso = models.CharField(choices=CURSO, max_length=50)
    año = models.CharField(choices=AÑO, max_length=50)
    materia = models.CharField(choices=MATERIAS, max_length=70)
    image = models.ImageField(upload_to=examen_img_path, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Pregunta(models.Model):
    examen = models.ForeignKey(Examen, on_delete=models.CASCADE, related_name="preguntas")
    pregunta = models.TextField()
    puntaje = models.DecimalField(max_digits=2, decimal_places=1)

    def __str__(self):
        return self.pregunta


class Respuesta(models.Model):
    pregunta = models.ForeignKey(Pregunta, on_delete=models.CASCADE, related_name="respuestas")
    respuesta = models.TextField()
    correcta = models.BooleanField(default=False)