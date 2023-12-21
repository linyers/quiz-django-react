from django.db import models
from alumnos.models import Alumno
from examenes.models import Pregunta, Respuesta


class QuizManager(models.Manager):
    def by_examen_and_alumno(self, alumno, examen):
        return self.filter(alumno=alumno, pregunta__examen=examen)


# Create your models here.
class Quiz(models.Model):
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE, related_name="quiz")
    pregunta = models.ForeignKey(
        Pregunta, on_delete=models.CASCADE, related_name="quiz"
    )
    correct_answer = models.BooleanField()

    objects = QuizManager()

    def __str__(self) -> str:
        return f"{self.alumno} - {self.pregunta} - {self.correct_answer}"


class QuizAnswers(models.Model):
    pregunta = models.ForeignKey(
        Pregunta, on_delete=models.CASCADE, related_name="answers"
    )
    answer = models.ForeignKey(
        Respuesta, on_delete=models.CASCADE, related_name="answers"
    )
