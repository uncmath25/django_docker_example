#!/bin/bash

/venv/bin/python manage.py collectstatic --noinput

# Give database time to start up
sleep 5

/venv/bin/python manage.py makemigrations todo_list
/venv/bin/python manage.py migrate

/venv/bin/uwsgi --show-config
