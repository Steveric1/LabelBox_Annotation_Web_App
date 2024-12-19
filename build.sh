#!/usr/bin/env bash

# Exit on error
set -o errexit

# Step 1: Install requirements.txt
pip install --upgrade pip
pip install -r requirements.txt

# Step 2: Collect static files and run migrations
python manage.py collectstatic --no-input

# Step 3: migrate database
python manage.py makemigrations
python manage.py migrate

# Step 4: Create a superuser
echo "from django.contrib.auth.models import User; \
if not User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists(): \
    User.objects.create_superuser('$DJANGO_SUPERUSER_USERNAME', '$DJANGO_SUPERUSER_EMAIL', '$DJANGO_SUPERUSER_PASSWORD')" | python manage.py shell
