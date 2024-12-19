from django import forms

class ImageSearchForm(forms.Form):
    name = forms.CharField(label='Search', max_length=100, required=False)
