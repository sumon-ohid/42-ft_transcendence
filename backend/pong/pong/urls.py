from django.urls import path, include

urlpatterns = [
    path('users/', include('users.urls')),  # Include the users app URLs
]
