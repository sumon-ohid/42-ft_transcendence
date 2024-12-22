from django.urls import path, include
from django.contrib import admin

urlpatterns = [
    path('', include('users.urls')),
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
]
