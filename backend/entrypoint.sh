#!/bin/sh

#Start the server in the background
python manage.py runserver 0.0.0.0:8000 &

#Wait for a few seconds to ensure the server has started
sleep 5

#Run migrations
python manage.py makemigrations
python manage.py migrate

#Bring the server to the foreground
fg %1