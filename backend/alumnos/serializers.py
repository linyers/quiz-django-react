from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers

from .models import Alumno, AlumnoExamen
from examenes.models import Examen

User = get_user_model()


class AlumnoCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    repeat_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Alumno
        fields = ('nombre', 'apellido', 'dni', 'año', 'curso', 'email', 'password', 'repeat_password', 'pic')

    def validate(self, attrs):
        if attrs['password'] != attrs['repeat_password']:
                raise serializers.ValidationError({'password': 'passwords do not match.'})
        attrs.pop('repeat_password')

        if not 7 < len(str(attrs['dni'])) < 9:
            raise serializers.ValidationError({'dni': 'invalid dni.'})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(email=validated_data['email'], password=validated_data['password'], is_student=True)

        try:
            validate_password(password=validated_data['password'], user=user)
        except ValidationError as err:
            user.delete()
            raise serializers.ValidationError({'password': err.messages})
        
        validated_data.pop('email')
        validated_data.pop('password')

        alumno = Alumno.objects.create(user=user, **validated_data)

        return alumno


class AlumnoSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Alumno
        fields = ('id', 'user', 'nombre', 'apellido', 'dni', 'año', 'curso', 'pic')

    def validate(self, attrs):
        if not 6 < len(str(attrs['dni'])) < 9:
            raise serializers.ValidationError({'dni': 'invalid dni.'})
        return attrs