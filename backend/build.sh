#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input

echo "Waiting for database to be ready..."
sleep 150

python manage.py migrate
python manage.py create_test_user
