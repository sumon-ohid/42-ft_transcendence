from django.contrib import admin
from .models import PlayerScore

# Register your models here.

@admin.register(PlayerScore)
class PlayerScoreAdmin(admin.ModelAdmin):
    list_display = ('player_name', 'score', 'date')