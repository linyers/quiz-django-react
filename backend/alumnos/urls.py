from django.urls import path, include
from .views import AlumnoViewSet, AlumnoCreateView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'alumnos', AlumnoViewSet, basename="alumno")
router.register(r'alumnos-create', AlumnoCreateView, basename="alumno-create")

app_name = 'alumnos'

urlpatterns = [
    path("", include(router.urls)),
]