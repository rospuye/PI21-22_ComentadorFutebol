import django.db.utils
from django.contrib.auth import authenticate
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
import json
from .business_logic.log_processing import process_log


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
    line_count = 0
    for line in uploaded_file:
        line_count+= 1
    print("line count: ")
    print(line_count)

    events = process_log(uploaded_file)

    count = 0
    for event in events:
        if count>10:
            break
        print(event)
        count += 1
    print(f"Total Number of Events: {len(events)}")

    return HttpResponse("file_upload_success")

