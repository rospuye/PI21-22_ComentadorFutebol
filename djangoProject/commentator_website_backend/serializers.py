from rest_framework import serializers, viewsets

from djangoProject.permissions import IsOwnerOrIsAdmin
from .models import Game, Preset
from django.contrib.auth.models import User


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'replay_file', 'title', 'description', 'user', 'is_public', 'league', 'year', 'round',
                  'match_group', 'processed_data']


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def get_queryset(self):
        print(f"get_queryset")
        queryset = Game.objects.all()
        query_params = self.request.query_params
        username = query_params.get('username')
        title = query_params.get('title', '')
        league = query_params.get('league', '')
        group = query_params.get('matchGroup', '')
        year = query_params.get('year')
        roud = query_params.get('round', '')
        sort_field = query_params.get('sort')

        if username is not None:
            queryset = queryset.filter(user__username=username)
            if not self.request.user.is_superuser and username != self.request.user.username:
                queryset = queryset.filter(is_public=True)

        elif not self.request.user.is_superuser:
            queryset = queryset.filter(is_public=True)

        queryset = queryset.filter(round__contains=roud)
        queryset = queryset.filter(title__contains=title)
        queryset = queryset.filter(league__contains=league)
        queryset = queryset.filter(match_group__contains=group)

        if year is not None:
            queryset = queryset.filter(year=year)
        if sort_field is not None:
            queryset = queryset.order_by(sort_field)

        return queryset


class UserSerializer(serializers.ModelSerializer):
    games = serializers.PrimaryKeyRelatedField(many=True, queryset=Game.objects.all())

    class Meta:
        model = User
        fields = ['id', 'username', 'games', 'presets']


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class PresetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preset
        fields = ['id', 'user', 'gender', 'aggressive_val', 'energetic_val', 'bias']


class PresetViewSet(viewsets.ModelViewSet):
    queryset = Preset.objects.all()
    serializer_class = PresetSerializer
    permission_classes = [IsOwnerOrIsAdmin]
