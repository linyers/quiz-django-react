from rest_framework import serializers
from .models import Alumno, AlumnoExamen
from examenes.models import Examen


class AlumnoSerializer(serializers.ModelSerializer):
    examen = serializers.IntegerField(write_only=True)
    nota = serializers.DecimalField(max_digits=2, decimal_places=1, write_only=True)

    class Meta:
        model = Alumno
        fields = ('nombre', 'apellido', 'dni', 'año', 'curso', 'examen', 'nota')
        extra_kwargs = {
            'nombre': {'read_only': True},
            'apellido': {'read_only': True},
            'dni': {'read_only': True},
            'año': {'read_only': True},
            'curso': {'read_only': True},
        }
    
    def update(self, instance, validated_data):
        examen_data = validated_data.pop('examen')
        nota = validated_data.pop('nota')
        
        examen = Examen.objects.get(title=examen_data)

        alumno_examen = AlumnoExamen(alumno=instance, examen=examen, nota=nota)
        alumno_examen.save()

        return instance
