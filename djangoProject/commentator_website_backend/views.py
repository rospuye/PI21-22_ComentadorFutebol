import django.db.utils
from django.contrib.auth import authenticate
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
import json

from djangoProject.permissions import IsOwnerOrIsAdmin
from .business_logic.log_processing import process_log
from .business_logic.nl_processing import generate_script
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, permissions
from rest_framework.authtoken.models import Token
from .models import Game
from .serializers import GameSerializer, UserSerializer

NUMBER_OF_GAMES_BY_USER = 10


@csrf_exempt
def new_login(request):
    user_str = request.body.decode()
    user_json = json.loads(user_str)
    username = user_json["username"]
    password = user_json["password"]

    user = authenticate(username=username, password=password)

    if user is not None:
        token = Token.objects.get(user=user)
        print(f"{token = }")
        return JsonResponse({"message": "login_success", "token": token.key})
    return JsonResponse({"message": "login_failure"})


@csrf_exempt
def new_register(request):
    user_str = request.body.decode()
    user_json = json.loads(user_str)
    username = user_json["username"]
    email = user_json["email"]
    password = user_json["password"]

    try:
        user = User.objects.create_user(username, email, password)
        user.save()
        token = Token.objects.create(user=user)
        print(f"register {token.key = }")
        return JsonResponse({"message": "register_success", "token": token.key})
    except django.db.utils.IntegrityError:
        return JsonResponse({"message": "username_already_in_use"})

class UserList(generics.ListAPIView):
    # Access only to the admin
    permission_classes = [permissions.IsAdminUser]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    # Access only to the admin and to the requested user
    permission_classes = [IsOwnerOrIsAdmin]
    queryset = User.objects.all()
    serializer_class = UserSerializer


@csrf_exempt
@api_view(['POST'])
def file_upload(request):
    # game_str = request.body.decode()
    # game_json = json.loads(game_str)
    # filename = game_json["fileName"]
    # print(filename)
    print("file uploaded")
    log_file = request.FILES['logFile']
    replay_file = request.FILES['replayFile']
    data = request.data
    # user_form = data["user"]
    title = data["title"]
    description = data["description"]
    is_public = True if data["isPublic"] == "Public" else False
    league = data["league"]
    try:
        year = int(data["year"])
    except:
        return JsonResponse({"message": "Year invalid"})
    roud = data["round"]
    match_group = data["matchGroup"]

    user = request.user
    if user.is_anonymous:
        return JsonResponse({"detail": "Authentication credentials were not provided."})

    # try:
    user_games = Game.objects.filter(user__username=user.username)
    # except Game.DoesNotExist:
    #     user_games = []

    if len(user_games) >= NUMBER_OF_GAMES_BY_USER:
        return JsonResponse({"error": "Reached number of games by given user."})
    events, analytics, form, form_players, teams = process_log(log_file)

    json_response = {"events": [], "form": form, "form_players": form_players}

    # new_game = Game.objects.create(uploaded_file, )
    if len(events) < 10:
        return Response({"message": "Processing Failed"})

    for event in events:
        json_response["events"].append(event.to_json())

    for timestamp in analytics:
        for team in analytics[timestamp]["teams"]:
            analytics[timestamp]["teams"][team] = analytics[timestamp]["teams"][team].to_json()
        for player in analytics[timestamp]["players"]:
            analytics[timestamp]["players"][player] = analytics[timestamp]["players"][player].to_json()
    json_response["stats"] = analytics


    # Another endpoint?
    # At this stage, fetch modifiers
    agr_frnd_mod = 0 # aggressive/friendly modifier (-50 to 50)
    en_calm_mod = 0 # energetic/calm modifier (-5 to 5)
    bias = 0 # -1 Left, 1 Right, 0 None
    # response = generate_script(json_response['events'], json_response["stats"], agr_frnd_mod, en_calm_mod, bias, teams)
    # print(f"{response = }")
    # print(f"{json_response = }")

    game = Game(replay_file=replay_file, title=title, description=description, user=user,
                is_public=is_public, league=league, year=year, round=roud, match_group=match_group,
                processed_data=json_response)

    game.save()


    serializer = GameSerializer(game)
    # print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA ")
    print(serializer.data['id'])
    return Response({'game_id': serializer.data['id']})

    # return Response(response)
