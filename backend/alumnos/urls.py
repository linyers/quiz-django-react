from django.urls import path, include
from .views import AlumnoViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'alumnos', AlumnoViewSet, basename="alumno")

app_name = 'alumnos'

urlpatterns = [
    path("", include(router.urls)),
]