from rest_framework import serializers
from .models import Pregunta, Respuesta, Examen


class RespuestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Respuesta
        fields = ('id', 'respuesta', 'correcta')


class PreguntaSerializer(serializers.ModelSerializer):
    respuestas = RespuestaSerializer(many=True)
    examen = serializers.IntegerField(required=True, write_only=True)

    class Meta:
        model = Pregunta
        fields = ('id', 'pregunta', 'puntaje', 'respuestas', 'examen')

    def validate(self, attrs):
        if not Examen.objects.filter(id=attrs['examen']).exists():
            raise serializers.ValidationError({'examen': 'El examen no existe'})
        return attrs
    
    def create(self, validated_data):
        respuestas_data = validated_data.pop('respuestas')
        examen_data = validated_data.pop('examen')
        examen = Examen.objects.get(id=examen_data)
        pregunta = Pregunta.objects.create(examen=examen, **validated_data)

        respuestas = [Respuesta(pregunta=pregunta, **respuesta) for respuesta in respuestas_data]
        Respuesta.objects.bulk_create(respuestas)
        
        return pregunta

    def update(self, instance, validated_data):
        validated_data.pop('examen')
        Respuesta.objects.filter(pregunta=instance).delete()
        respuestas_data = validated_data.pop('respuestas')
        respuestas = [Respuesta(pregunta=instance, **respuesta) for respuesta in respuestas_data]
        Respuesta.objects.bulk_create(respuestas)
        
        instance = super().update(instance, validated_data)
        return instance


class ExamenPreguntasSerializer(serializers.ModelSerializer):
    preguntas = PreguntaSerializer(many=True, read_only=True)

    class Meta:
        model = Examen
        fields = ('id', 'title', 'start', 'end', 'preguntas')


class ExamenPartialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Examen
        fields = ('id', 'title', 'image', 'curso', 'año', 'materia', 'created_at', 'start', 'end')