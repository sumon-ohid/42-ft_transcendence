from django.urls import path, include
from .views import index, api_signup, api_login
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", index, name="index"),
    path('api/signup/', api_signup, name='api_signup'),
    path('api/login/', api_login, name='api_login'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)