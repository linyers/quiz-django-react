from django.urls import path, include
from .views import AlumnoViewSet, AlumnoCreateView, AlumnoExamenViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'alumnos', AlumnoViewSet, basename="alumno")
router.register(r'alumnos-create', AlumnoCreateView, basename="alumno-create")
router.register(r'alumnos-examen', AlumnoExamenViewSet, basename="alumno-examen")

app_name = 'alumnos'

urlpatterns = [
    path("", include(router.urls)),
]