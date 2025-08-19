
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Creates a test user for the application'

    def handle(self, *args, **options):
        if not User.objects.filter(username='test_cred').exists():
            User.objects.create_user('test_cred', 'test_cred@example.com', 'test_cred')
            self.stdout.write(self.style.SUCCESS('Successfully created test_cred user'))
        else:
            self.stdout.write(self.style.WARNING('test_cred user already exists'))
