from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExamenPreguntasView, ExamenPartialView, PreguntasViewSet, PreguntasProtectedViewSet

router = DefaultRouter()
router.register(r'preguntas', PreguntasViewSet, basename="pregunta")
router.register(r'examen-complete', ExamenPreguntasView, basename="examen_complete")
router.register(r'examen-partial', ExamenPartialView, basename="examen_partial")
router.register(r'preguntas-protected', PreguntasProtectedViewSet, basename="pregunta_protected")

urlpatterns = [
    path("", include(router.urls)),
]
