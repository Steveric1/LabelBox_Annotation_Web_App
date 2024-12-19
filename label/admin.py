from django.contrib import admin
from .models import Image, Annotation

# Register your models here.
admin.site.register(Image)
admin.site.register(Annotation)