from django.db import models

# Create your models here.
class PlayerScore(models.Model):
    player_name = models.CharField(max_length=100)
    score = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player_name}: {self.score}"
