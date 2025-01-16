from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from users import consumers
from django.conf.urls.i18n import i18n_patterns
from django.views.i18n import JavaScriptCatalog

websocket_urlpatterns = [
    path('ws/chat/', consumers.ChatConsumer.as_asgi()),
]

urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),  # Nyelvválasztás URL-je
]

urlpatterns += i18n_patterns(
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('', include('users.urls')),
)

urlpatterns += websocket_urlpatterns