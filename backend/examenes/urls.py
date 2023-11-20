from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExamenPreguntasView, ExamenPartialView, PreguntasViewSet

router = DefaultRouter()
router.register(r'preguntas', PreguntasViewSet, basename="pregunta")
router.register(r'examen-complete', ExamenPreguntasView, basename="examen_complete")
router.register(r'examen-partial', ExamenPartialView, basename="examen_partial")

urlpatterns = [
    path("", include(router.urls)),
]
