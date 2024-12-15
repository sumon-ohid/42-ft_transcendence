#!/bin/bash

echo -e "Waiting for Postgres to be ready!"
sleep 3

python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000