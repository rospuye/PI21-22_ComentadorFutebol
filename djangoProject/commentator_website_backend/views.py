import django.db.utils
from django.contrib.auth import authenticate
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.core.files import File
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

NUMBER_OF_GAMES_BY_USER = 19


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
@api_view(['GET'])
def game_generate_script(request, i):
    game = Game.objects.get(id=i)
    data = game.processed_data
    params = request.query_params

    agr_frnd_mod = params.get("agr_frnd_mod", 0)  # aggressive/friendly modifier (-50 to 50)
    en_calm_mod = params.get("en_calm_mod", 0)  # energetic/calm modifier (-5 to 5)
    bias = params.get("bias", 0)  # -1 Left, 1 Right, 0 None
    try:
        bias = int(bias)
        agr_frnd_mod = int(agr_frnd_mod)
        en_calm_mod = int(en_calm_mod)
    except:
        return Response({"message": "Not valid modifiers!"})

    response = generate_script(data["events"], data["stats"], agr_frnd_mod, en_calm_mod, bias, data["teams"])
    # for commentary in response:
    #     print(f"{commentary = }")

    return Response(response)


@csrf_exempt
@api_view(['POST'])
def file_upload(request):
    print("File uploaded.")
    log_file = request.FILES['logFile']
    replay_file = None
    hasReplay = 'replayFile' in request.FILES
    data = request.data
    title = data["title"]
    description = data["description"]
    is_public = True if data["isPublic"] == "Public" else False
    league = data["league"]
    try:
        year = int(data["year"])
    except:
        print("ERROR 1")
        return JsonResponse({"message": "Year invalid"})
    roud = data["round"]
    match_group = data["matchGroup"]

    print(f"{data['has_replay'] = }")
    try:
        has_replay = True if data["has_replay"] == "true" else False
    except:
        print("ERROR 2")
        return JsonResponse({"message": "has_replay invalid"})
    print(f"{has_replay = }")

    user = request.user
    if user.is_anonymous:
        return JsonResponse({"detail": "Authentication credentials were not provided."})

    user_games = Game.objects.filter(user__username=user.username)

    if len(user_games) >= NUMBER_OF_GAMES_BY_USER:
        return JsonResponse({"error": "Reached number of games by given user."})

    try:
        events, analytics, form, form_players, teams, rep_file = process_log(log_file, createReplay=not has_replay)
    except AssertionError:
        return JsonResponse({"error": "Processing Failed"})

    json_response = {"events": [], "form": form, "form_players": form_players, "teams": teams}

    # if len(events) < 10:
    #     print("ERROR 3")
    #     return Response({"error": "Processing Failed"})

    for event in events:
        json_response["events"].append(event.to_json())

    for timestamp in analytics:
        for team in analytics[timestamp]["teams"]:
            analytics[timestamp]["teams"][team] = analytics[timestamp]["teams"][team].to_json()
        for player in analytics[timestamp]["players"]:
            analytics[timestamp]["players"][player] = analytics[timestamp]["players"][player].to_json()
    json_response["stats"] = analytics

    if hasReplay:
        replay_file = request.FILES['replayFile']
    else:
        replay_file = File( open("replayfile.replay", "r"))
        
        


    game = Game(replay_file=replay_file, title=title, description=description, user=user,
                is_public=is_public, league=league, year=year, round=roud, match_group=match_group,
                processed_data=json_response)

    game.save()

    if not hasReplay:
        replay_file.close()
        rep_file.close()

    serializer = GameSerializer(game)
    print("ID", serializer.data['id'])
    return Response({'game_id': serializer.data['id']})
