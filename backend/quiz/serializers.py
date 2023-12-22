from rest_framework import serializers
from .models import Quiz


class QuizSerializer(serializers.ModelSerializer):
    alumno_answers = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = (
            "pregunta",
            "alumno_answers",
        )

    def get_alumno_answers(self, obj):
        return obj.pregunta.answers.values_list("answer", flat=True)
