from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExamenPreguntasView, ExamenPartialView, PreguntasViewSet

router = DefaultRouter()
router.register(r'preguntas', PreguntasViewSet, basename="pregunta")

urlpatterns = [
    path("", include(router.urls)),
    path("examen-complete/", ExamenPreguntasView.as_view(), name='examen_complete'),
    path("examen-partial/", ExamenPartialView.as_view(), name='examen_partial'),
]
