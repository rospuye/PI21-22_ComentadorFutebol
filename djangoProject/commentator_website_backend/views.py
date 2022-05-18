import django.db.utils
from django.contrib.auth import authenticate
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
import json
from .business_logic.log_processing import process_log
from .business_logic.nl_processing import generate_script
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Game


@csrf_exempt
def new_login(request):
    user_str = request.body.decode()
    user_json = json.loads(user_str)
    username = user_json["username"]
    password = user_json["password"]

    user = authenticate(username=username, password=password)

    if user is not None:
        return HttpResponse("login_success")
    return HttpResponse("login_failure")


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
        return HttpResponse("register_success")
    except django.db.utils.IntegrityError:
        return HttpResponse("username_already_in_use")


@csrf_exempt
@api_view(['POST'])
def file_upload(request):
    # game_str = request.body.decode()
    # game_json = json.loads(game_str)
    # filename = game_json["fileName"]
    # print(filename)

    uploaded_file = request.FILES['file']
    events, analytics, form, form_players = process_log(uploaded_file)
    json_response = {"events": [], "form": form, "form_players": form_players}

    # new_game = Game.objects.create(uploaded_file, )

    for event in events:
        json_response["events"].append(event.to_json())
        
    for timestamp in analytics:
        for team in analytics[timestamp]["teams"]:
            analytics[timestamp]["teams"][team] = analytics[timestamp]["teams"][team].to_json()
        for player in analytics[timestamp]["players"]:
            analytics[timestamp]["players"][player] = analytics[timestamp]["players"][player].to_json()
    json_response["stats"] = analytics

    response = generate_script(json_response['events'], json_response["stats"])
    print(f"{response = }")

    return Response(response)

