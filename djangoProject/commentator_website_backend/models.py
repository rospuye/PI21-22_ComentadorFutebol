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
    logfile = models.FileField(upload_to="logs")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    isPublic = models.BooleanField()
    jasminLink = models.CharField(max_length=255)
    league = models.CharField(max_length=255)
    year = models.IntegerField()
    round = models.CharField(max_length=255)
    matchGroup = models.CharField(max_length=255)

