#!/bin/bash

echo -e "Waiting for Postgres to be ready!"
sleep 3

export DJANGO_SETTINGS_MODULE=pong.settings

python manage.py makemigrations
python manage.py migrate
# python manage.py collectstatic --noinput
daphne -e ssl:8000:privateKey=ssl/key.pem:certKey=ssl/cert.pem pong.asgi:application