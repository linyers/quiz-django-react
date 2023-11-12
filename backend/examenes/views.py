from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status

from .serializer import ExamenPreguntasSerializer, ExamenPartialSerializer, PreguntaSerializer
from .models import Examen, Pregunta, Respuesta


class ExamenPreguntasView(APIView):
    def get(self, request, *args, **kwargs):
        id = request.query_params.get('id')
        print(id)
        examen = Examen.objects.get(id=id)
        serializer = ExamenPreguntasSerializer(examen)
        return Response(serializer.data)


class ExamenPartialView(APIView):
    def get(self, request, *args, **kwargs):
        examenes = Examen.objects.all()
        serializer = ExamenPartialSerializer(examenes, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = ExamenPartialSerializer(data=request.data)
        if serializer.is_valid():
            examen = Examen.objects.create(**serializer.data)
            examen.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        examen_title = request.data['id']
        examen = Examen.objects.get(id=examen_title)
        serializer = ExamenPartialSerializer(examen, request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PreguntasViewSet(viewsets.ModelViewSet):
    queryset = Pregunta.objects.all()
    serializer_class = PreguntaSerializer