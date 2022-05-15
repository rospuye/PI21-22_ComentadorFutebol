import django.db.utils
from django.contrib.auth import authenticate
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
import json
from .business_logic.log_processing import process_log
from .business_logic.nl_processing import generate_script
from rest_framework.response import Response


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
def file_upload(request):
    uploaded_file = request.FILES['file']
    # line_count = 0
    # for line in uploaded_file:
    #     line_count+= 1
    # print("line count: ")
    # print(line_count)

    print(type(uploaded_file))
    events = process_log(uploaded_file)
    events_json = {"events": []};
    # print(str(events))
    print(f"{events = }")
    print(f"{events[0] = }")
    print(f"{events[1] = }")
    print(f"{events[2] = }")

    for event in events:
        events_json["events"].append(event.to_json())
    # print(events_json)
    # events_nl = {"texts": generate_script(events)}
    # print(f"{events = }")
    print(f"{events_json = }")
    response = generate_script(events_json['events'])
    print(f"{response = }")
    # response = json.dumps(events_nl)
    # count = 0
    # for event in events:
    #     if count>10:
    #         break
    #     print(event)
    #     count += 1
    # print(f"Total Number of Events: {len(events)}")

    return Response(response)

