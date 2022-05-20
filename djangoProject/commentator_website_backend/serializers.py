from rest_framework import serializers, viewsets
from .models import Game
from django.contrib.auth.models import User


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'logfile', 'title', 'description', 'user', 'isPublic', 'league', 'year', 'round', 'matchGroup']


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class UserSerializer(serializers.ModelSerializer):
    games = serializers.PrimaryKeyRelatedField(many=True, queryset=Game.objects.all())

    class Meta:
        model = User
        fields = ['id', 'username', 'games']


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
