from rest_framework import mixins, status
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny

from utils.permissions import IsTeacher
from .models import Alumno, AlumnoExamen
from .serializers import AlumnoSerializer, AlumnoCreateSerializer, AlumnoExamenSerializer


class AlumnoCreateView(mixins.CreateModelMixin, GenericViewSet):
    queryset = Alumno.objects.all()
    serializer_class = AlumnoCreateSerializer
    permission_classes = [IsAuthenticated, IsTeacher]


class AlumnoViewSet(mixins.UpdateModelMixin,
                    mixins.ListModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.DestroyModelMixin,
                    GenericViewSet):
    
    queryset = Alumno.objects.all()
    serializer_class = AlumnoSerializer

    def get_permissions(self):
        if self.action == "retrieve" or self.action == "list":
            permission_classes = [
                AllowAny,
            ]
        else:
            permission_classes = [IsAuthenticated, IsTeacher]
        return [permission() for permission in permission_classes]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AlumnoExamenViewSet(ModelViewSet):
    queryset = AlumnoExamen.objects.all()
    serializer_class = AlumnoExamenSerializer

    def get_permissions(self):
        if self.action == "retrieve" or self.action == "list" or self.action == "create":
            permission_classes = [
                IsAuthenticated,
            ]
        else:
            permission_classes = [IsAuthenticated, IsTeacher]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        params = self.request.query_params

        if not params:
            return super().get_queryset()

        QUERY_DICT = {
            'by-alumno': 'alumno__id',
            'by-examen': 'examen__id',
        }

        data = {
            QUERY_DICT[k]: params.get(k) for k in QUERY_DICT.keys() if params.get(k)
        }
        
        return AlumnoExamen.objects.filter(**data)
