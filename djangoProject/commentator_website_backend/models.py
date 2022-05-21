from django.db import models
import uuid
from django.contrib.auth.models import User


# Create your models here.

class Preset(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    gender = models.CharField(max_length=255)
    aggressiveVal = models.IntegerField()
    energeticVal = models.IntegerField()
    bias = models.IntegerField()


class Game(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    replay_file = models.FileField(upload_to="replays")
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=255)
    user = models.ForeignKey(User, related_name="games", on_delete=models.CASCADE)
    isPublic = models.BooleanField()
    processed_data = models.JSONField()
    # jasminLink = models.CharField(max_length=255)
    league = models.CharField(max_length=50)
    year = models.IntegerField()
    round = models.CharField(max_length=50)
    matchGroup = models.CharField(max_length=50)

