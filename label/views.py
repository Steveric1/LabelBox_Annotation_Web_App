from django.shortcuts import render, get_object_or_404
from django.db.models import Q
from .models import Image, Annotation
from .forms import ImageSearchForm
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
# import random


def home(request, image_id=None):
    if image_id:
        try:
            image = get_object_or_404(Image, id=image_id)
        except:
            image = None
    else:
        try:
            image = Image.objects.filter(annotation__isnull=True).order_by('?').first()
        except:
            image = None
        
    return render(request, 'label/home.html', {'image': image})

def save_annotation(request):
    if request.method == 'POST':
        image_id = request.POST.get('image_id')
        x = request.POST.get('x')
        y = request.POST.get('y')
        width = request.POST.get('width')
        height = request.POST.get('height')
        
        print(f"Received data: {image_id}, {x}, {y}, {width}, {height}")
        
        if not all([image_id, x, y, width, height]):
            return JsonResponse({"message": "Invalid data!"})
        
        try:
            image = get_object_or_404(Image, id=image_id)
            annotation = Annotation.objects.create(image=image, x=x, y=y, width=width, height=height)
            return JsonResponse({"message": "Annotation saved successfully!", "annotation_id": annotation.id})
        except Exception as e:
            return JsonResponse({"message": f"Error: {e}"}, status=500)


