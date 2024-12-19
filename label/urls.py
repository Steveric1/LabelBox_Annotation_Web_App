from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("<int:image_id>/", views.home, name="image"),
    path("save_annotation/", views.save_annotation, name="save_annotation"),
]