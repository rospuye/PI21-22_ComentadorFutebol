"""djangoProject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from commentator_website_backend import views, serializers
from rest_framework import routers

from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r'games', serializers.GameViewSet, basename='Game')
router.register(r'presets', serializers.PresetViewSet, basename='Preset')
router.register(r'users', serializers.UserViewSet, basename='User')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/login/', views.new_login),
    path('users/register/', views.new_register),
    path('generate_script/<str:i>', views.game_generate_script),
    path('file_upload/', views.file_upload),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
