from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from examenes.models import Pregunta
from .models import Quiz
from .serializers import QuizSerializer

# Create your views here.
class QuizViewSet(mixins.CreateModelMixin,
                mixins.ListModelMixin,
                viewsets.GenericViewSet):
    queryset = []
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        params = self.request.query_params

        if not params:
            return super().get_queryset()

        QUERY_DICT = {
            'alumno': 'alumno__id',
        }

        data = {
            QUERY_DICT[k]: params.get(k) for k in QUERY_DICT.keys() if params.get(k)
        }
        
        return Quiz.objects.filter(**data)

    def list(self, request, *args, **kwargs):
        if request.user.is_student:
            queryset = Quiz.objects.filter(alumno=request.user.alumno)
            serializer = QuizSerializer(queryset, many=True)
            return Response(serializer.data)
        return super().list(request, *args, **kwargs)
    
    # The user send many preguntas in a list, this check what is a correct
    def create(self, request, *args, **kwargs):
        if request.user.is_student:
            request.data['alumno'] = request.user.alumno.id
        
        respuestas = request.data.get('respuestas', [])
        pregunta = request.data.get('pregunta')
        request.data.pop('correct_answer', None)

        if not pregunta:
            return super().create(request, *args, **kwargs)
        
        if not Pregunta.objects.filter(id=pregunta).exists():
            return super().create(request, *args, **kwargs)
        
        pregunta_obj = Pregunta.objects.get(id=pregunta)
        respuestas_obj_list = pregunta_obj.respuestas.filter(id__in=respuestas, correcta=True)

        if len(respuestas_obj_list) != len(respuestas):
            request.data['correct_answer'] = False
            return super().create(request, *args, **kwargs)
        
        request.data['correct_answer'] = True
        
        return super().create(request, *args, **kwargs)