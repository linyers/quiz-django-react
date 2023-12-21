from rest_framework import serializers
from .models import Quiz


class QuizSerializer(serializers.ModelSerializer):
    respuestas = serializers.SerializerMethodField()
    alumno_answers = serializers.SerializerMethodField()
    pregunta = serializers.StringRelatedField()
    puntaje = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = (
            "id",
            "alumno",
            "pregunta",
            "puntaje",
            "correct_answer",
            "respuestas",
            "alumno_answers",
        )

    def get_respuestas(self, obj):
        return obj.pregunta.respuestas.values("id", "respuesta")

    def get_alumno_answers(self, obj):
        return obj.pregunta.answers.values_list("answer", flat=True)

    def get_puntaje(self, obj):
        return obj.pregunta.puntaje
