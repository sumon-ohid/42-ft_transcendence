from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField

# Create your models here.

# For score board
class PlayerScore(models.Model):
    player_name = models.CharField(max_length=255, unique=True)
    total_score = models.IntegerField(default=0)
    scores = ArrayField(models.IntegerField(), default=list)
    last_updated = models.DateTimeField(auto_now=True)

    def latest_score(self):
        return self.scores[-1] if self.scores else None

    latest_score.short_description = "Latest Score"

    def __str__(self):
        return self.player_name


# For profile picture
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)

    def __str__(self):
        return self.user.username

