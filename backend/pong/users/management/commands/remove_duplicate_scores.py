from django.core.management.base import BaseCommand
from users.models import PlayerScore

class Command(BaseCommand):
    help = 'Remove duplicate PlayerScore entries'

    def handle(self, *args, **kwargs):
        seen = set()
        duplicates = []
        for score in PlayerScore.objects.all():
            if score.player_name in seen:
                duplicates.append(score.id)
            else:
                seen.add(score.player_name)
        
        PlayerScore.objects.filter(id__in=duplicates).delete()
        self.stdout.write(self.style.SUCCESS('Successfully removed duplicate PlayerScore entries'))
