from django.contrib import admin
from .models import PlayerScore

# Register your models here.

class PlayerScoreAdmin(admin.ModelAdmin):
    list_display = ('player_name', 'total_score', 'latest_score', 'last_updated')

admin.site.register(PlayerScore, PlayerScoreAdmin)
