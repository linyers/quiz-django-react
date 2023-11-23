from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        if user.is_student:
            token['nombre'] = user.alumno.nombre
            token['apellido'] = user.alumno.apellido
            token['pic'] = str(user.alumno.pic)
        token['is_student'] = user.is_student
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer