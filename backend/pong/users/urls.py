from django.urls import path, include
from .views import index, api_signup, api_login, api_logout, get_username, save_score, \
    upload_profile_picture, get_profile_picture, leaderboard, get_play_history, \
    change_username, change_password, disable_2fa, verify_2fa, setup_2fa, get_2fa_status, \
    get_users, add_block, remove_block, get_user_profile, intra42_login, callback_view, \
    redirect_to_home, long_poll, send_message
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
    path('api/get-play-history/<str:username>/', get_play_history, name='get_play_history'),
    path('api/change-username/', change_username, name='change_username'),
    path('api/change-password/', change_password, name='change_password'),
    path('api/disable-2fa/', disable_2fa, name='disable_2fa'),
    path('api/setup-2fa/', setup_2fa, name='setup_2fa'),
    path('api/get-2fa-status/', get_2fa_status, name='get_2fa_status'),
    path('api/verify-2fa/', verify_2fa, name='verify_2fa'),
    path('api/users/', get_users, name='get_users'),
    path('api/add-block/<str:username>/', add_block, name='add_block'),
    path('api/remove-block/<str:username>/', remove_block, name='remove_block'),
    path('api/user-profile/<str:username>/', get_user_profile, name='get_user_profile'),
    path('api/auth/intra42/', intra42_login, name='intra42_login'),
    path('accounts/social/login/callback/', callback_view, name='callback'),
    path('api/redirect/', redirect_to_home, name='redirect_to_home'),
    path('chat/long-poll/', long_poll, name='long_poll'),
    path('chat/send-message/', send_message, name='send_message'),
]


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
