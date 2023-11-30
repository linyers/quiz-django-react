from django.db import models
from alumnos.models import Alumno
from examenes.models import Pregunta

# Create your models here.
class Quiz(models.Model):
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE, related_name='quiz')
    pregunta = models.ForeignKey(Pregunta, on_delete=models.CASCADE, related_name='quiz')
    correct_answer = models.BooleanField()

    def __str__(self) -> str:
        return f"{self.alumno} - {self.pregunta} - {self.correct_answer}"