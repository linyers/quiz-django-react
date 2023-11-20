from rest_framework import mixins, status
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny

from utils.permissions import IsTeacher
from .models import Alumno
from .serializers import AlumnoSerializer, AlumnoCreateSerializer


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