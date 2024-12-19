from django.db import models


class Image(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to='images/')
    
    def __str__(self):
        return self.name


class Annotation(models.Model):
    image = models.ForeignKey(Image, on_delete=models.CASCADE)
    x = models.FloatField()
    y = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
