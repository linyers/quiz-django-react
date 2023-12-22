from rest_framework import viewsets, mixins, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from examenes.serializer import PreguntaSerializer
from examenes.models import Pregunta
from alumnos.models import AlumnoExamen
from .models import Quiz, QuizAnswers
from .serializers import QuizSerializer


# Create your views here.
class QuizViewSet(
    mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    queryset = []
    serializer_class = QuizSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def list(self, request, *args, **kwargs):
        examen = request.query_params.get("examen", None)
        if request.user.is_student and examen:
            queryset = Quiz.objects.by_examen_and_alumno(
                alumno=request.user.alumno, examen=examen
            )
            serializer = QuizSerializer(queryset, many=True)
            nota = AlumnoExamen.objects.filter(
                alumno=request.user.alumno, examen__id=examen
            ).values_list("nota", flat=True)[0]
            preguntas = Pregunta.objects.filter(examen__id=examen)
            preguntas = PreguntaSerializer(preguntas, many=True)
            return Response(
                {"nota": nota, "quiz": serializer.data, "preguntas": preguntas.data}
            )
        return Response([])

    # The user send many preguntas in a list, this check what is a correct
    def create(self, request, *args, **kwargs):
        if not request.user.is_student:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        quiz = []
        answers = []
        nota = 0

        for item in request.data:
            respuestas = item.get("respuestas", [])
            pregunta = item.get("pregunta")
            item.pop("correct_answer", None)

            if not pregunta:
                return Response({"created": False}, status=status.HTTP_400_BAD_REQUEST)

            if not Pregunta.objects.filter(id=pregunta).exists():
                return Response({"created": False}, status=status.HTTP_400_BAD_REQUEST)

            pregunta_obj = Pregunta.objects.get(id=pregunta)
            respuestas_obj_list = pregunta_obj.respuestas.filter(
                id__in=respuestas, correcta=True
            )

            if len(respuestas) == 0:
                continue

            if len(respuestas_obj_list) != len(respuestas):
                item["correct_answer"] = False
            else:
                item["correct_answer"] = True
                nota += pregunta_obj.puntaje

            quiz.append(
                Quiz(
                    alumno=request.user.alumno,
                    pregunta=pregunta_obj,
                    correct_answer=item["correct_answer"],
                )
            )

            for r in item["respuestas"]:
                respuesta_obj = pregunta_obj.respuestas.get(id=r)
                answers.append(QuizAnswers(pregunta=pregunta_obj, answer=respuesta_obj))

        Quiz.objects.bulk_create(quiz)
        QuizAnswers.objects.bulk_create(answers)

        AlumnoExamen.objects.create(
            alumno=request.user.alumno, examen=pregunta_obj.examen, nota=nota
        )

        return Response({"created": True})
