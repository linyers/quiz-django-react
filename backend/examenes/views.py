from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from utils.permissions import IsTeacher
from .serializer import ExamenPreguntasSerializer, ExamenPartialSerializer, PreguntaSerializer
from .models import Examen, Pregunta


class ExamenPreguntasView(mixins.RetrieveModelMixin,
                        viewsets.GenericViewSet):
    queryset = Examen.objects.all()
    serializer_class = ExamenPreguntasSerializer
    permission_classes = [IsAuthenticated,]


class ExamenPartialView(mixins.ListModelMixin,
                        mixins.CreateModelMixin,
                        mixins.UpdateModelMixin,
                        mixins.DestroyModelMixin,
                        viewsets.GenericViewSet):
    queryset = Examen.objects.all()
    serializer_class = ExamenPartialSerializer

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
            queryset = queryset.filter(año=request.user.alumno.año)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class PreguntasViewSet(viewsets.ModelViewSet):
    queryset = Pregunta.objects.all()
    serializer_class = PreguntaSerializer
    permission_classes = [IsAuthenticated, IsTeacher,]