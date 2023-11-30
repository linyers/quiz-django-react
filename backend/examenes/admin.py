from django.contrib import admin
from .models import Examen, Pregunta, Respuesta

class ExamenAdmin(admin.ModelAdmin):
    readonly_fields = ('slug',)

admin.site.register(Examen, ExamenAdmin)
admin.site.register(Pregunta)
admin.site.register(Respuesta)
