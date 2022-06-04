from rest_framework import serializers, viewsets

from djangoProject.permissions import IsOwnerOrIsAdmin
from .models import Game, Preset
from django.contrib.auth.models import User
from rest_framework.response import Response
from django.conf import settings


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'replay_file', 'title', 'description', 'user', 'is_public', 'league', 'year', 'round',
                  'match_group', 'processed_data']


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def get_queryset(self):
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
        fields = ['id', 'user', 'name', 'gender', 'aggressive_val', 'energetic_val', 'bias']


class PresetViewSet(viewsets.ModelViewSet):
    queryset = Preset.objects.all()
    serializer_class = PresetSerializer
    permission_classes = [IsOwnerOrIsAdmin]
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return []

        queryset = Preset.objects.filter(user=user)
        return queryset

    def create(self, request, *args, **kwargs):
        data = request.data
        missing_fields = []

        if "name" not in data:
            missing_fields.append("name")

        if "gender" not in data:
            missing_fields.append("gender")

        if "aggressive_val" not in data:
            missing_fields.append("aggressive_val")

        if "energetic_val" not in data:
            missing_fields.append("energetic_val")

        if "bias" not in data:
            missing_fields.append("bias")

        if len(missing_fields) != 0:
            miss_fields = ""
            for field in missing_fields:
                miss_fields += field + ","

            return Response({"message": f"Missing fields: {miss_fields[:-1]}."})

        user = request.user
        if user.is_anonymous:
            return Response({"message": "Not authenticated user."})

        preset = Preset(name=data["name"], gender=data["gender"], aggressive_val=data["aggressive_val"],
                        energetic_val=data["energetic_val"], bias=data["bias"], user=user)
        preset.save()
        serializer = PresetSerializer(preset)

        return Response(serializer.data)
