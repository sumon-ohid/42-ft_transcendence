from django.urls import path, include
from .views import index, api_signup, api_login, api_logout, get_username, save_score, \
    upload_profile_picture, get_profile_picture, leaderboard, get_play_history, \
    change_username, change_password, disable_2fa, verify_2fa, setup_2fa, get_2fa_status
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", index, name="index"),
    path('api/signup/', api_signup, name='api_signup'),
    path('api/login/', api_login, name='api_login'),
    path('api/logout/', api_logout, name='api_logout'),
    path('api/get-username/', get_username, name='get_username'),
    path('api/save-score/', save_score, name='save_score'),
    path('api/upload-profile-picture/', upload_profile_picture, name='upload_profile_picture'),
    path('api/get-profile-picture/', get_profile_picture, name='get_profile_picture'),
    path('api/leaderboard/', leaderboard, name='leaderboard'),
    path('api/get-play-history/', get_play_history, name='get_play_history'),
    path('api/change-username/', change_username, name='change_username'),
    path('api/change-password/', change_password, name='change_password'),
    path('api/disable-2fa/', disable_2fa, name='disable_2fa'),
    path('api/setup-2fa/', setup_2fa, name='setup_2fa'),
    path('api/get-2fa-status/', get_2fa_status, name='get_2fa_status'),
    path('api/verify-2fa/', verify_2fa, name='verify_2fa'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
