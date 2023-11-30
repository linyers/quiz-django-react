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
        
        # correctas = 0
        # for respuesta in attrs['respuestas']:
        #     if correctas == 1 and respuesta['correcta']:
        #         raise serializers.ValidationError({'respuesta': 'Solo puede haber una respuesta correcta'})
        #     if respuesta['correcta']:
        #         correctas += 1
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

# This serializers is for send it a alumnos user, dont show the correct answer
class RespuestaProtectedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Respuesta
        fields = ('id', 'respuesta')


# This serializers is for send it a alumnos user, dont show the correct answer
class PreguntaProtectedSerializer(serializers.ModelSerializer):
    respuestas = RespuestaProtectedSerializer(many=True)
    examen = serializers.IntegerField(required=True, write_only=True)

    class Meta:
        model = Pregunta
        fields = ('id', 'pregunta', 'puntaje', 'respuestas', 'examen')


class ExamenPreguntasSerializer(serializers.ModelSerializer):
    preguntas = PreguntaSerializer(many=True, read_only=True)

    class Meta:
        model = Examen
        fields = ('id', 'title', 'max_nota', 'start', 'end', 'preguntas', 'image', 'año', 'curso', 'materia', 'slug')
        extra_kwargs = {
            'slug': {'read_only': True},
            'max_nota': {'read_only': True}
        }

class ExamenPartialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Examen
        fields = ('id', 'title', 'image', 'curso', 'año', 'materia', 'created_at', 'start', 'end', 'max_nota', 'slug')
        extra_kwargs = {
            'slug': {'read_only': True},
            'max_nota': {'read_only': True}
        }