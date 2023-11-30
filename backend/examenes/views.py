from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from utils.permissions import IsTeacher
from .serializer import ExamenPreguntasSerializer, ExamenPartialSerializer, PreguntaSerializer, PreguntaProtectedSerializer
from .models import Examen, Pregunta


class ExamenPreguntasView(mixins.RetrieveModelMixin,
                        viewsets.GenericViewSet):
    queryset = Examen.objects.all()
    serializer_class = ExamenPreguntasSerializer
    permission_classes = [IsAuthenticated,]
    lookup_field = 'slug'


class ExamenPartialView(mixins.ListModelMixin,
                        mixins.CreateModelMixin,
                        mixins.UpdateModelMixin,
                        mixins.DestroyModelMixin,
                        viewsets.GenericViewSet):
    queryset = Examen.objects.all()
    serializer_class = ExamenPartialSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action == "retrieve" or self.action == "list":
            permission_classes = [
                IsAuthenticated,
            ]
        else:
            permission_classes = [IsAuthenticated, IsTeacher]
        return [permission() for permission in permission_classes]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        if request.user.is_student:
            queryset = queryset.filter(año=request.user.alumno.año, curso=request.user.alumno.curso)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class PreguntasViewSet(viewsets.ModelViewSet):
    queryset = Pregunta.objects.all()
    serializer_class = PreguntaSerializer
    permission_classes = [IsAuthenticated, IsTeacher,]

    def get_queryset(self):
        params = self.request.query_params

        if not params:
            return super().get_queryset()

        QUERY_DICT = {
            'examen': 'examen__id',
        }

        data = {
            QUERY_DICT[k]: params.get(k) for k in QUERY_DICT.keys() if params.get(k)
        }
        
        return Pregunta.objects.filter(**data)


class PreguntasProtectedViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    queryset = []
    serializer_class = PreguntaProtectedSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        params = self.request.query_params

        if not params:
            return super().get_queryset()

        QUERY_DICT = {
            'examen': 'examen__id',
        }

        data = {
            QUERY_DICT[k]: params.get(k) for k in QUERY_DICT.keys() if params.get(k)
        }
        
        return Pregunta.objects.filter(**data)
