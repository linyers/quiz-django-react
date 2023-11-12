from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet
from .models import Alumno
from .serializers import AlumnoSerializer


class AlumnoViewSet(mixins.UpdateModelMixin,
                    mixins.ListModelMixin,
                    GenericViewSet):
    
    queryset = Alumno.objects.all()
    serializer_class = AlumnoSerializer