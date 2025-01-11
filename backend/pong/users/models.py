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
    two_factor_enabled = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

class Friendship(models.Model):
    user = models.ForeignKey(User, related_name='friendships', on_delete=models.CASCADE)
    friend = models.ForeignKey(User, related_name='friends', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'friend')


class ChatMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages")
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} to {self.receiver}: {self.message[:20]}"

# For Tourmanent
class Tournament(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    players = models.ManyToManyField(User, related_name='tournaments')
    winner = models.ForeignKey(User, related_name='won_tournaments', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name