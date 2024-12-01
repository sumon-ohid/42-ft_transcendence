from django.urls import path, include
from .views import index, api_signup, api_login, api_logout, get_username, save_score, upload_profile_picture, get_profile_picture
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
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)