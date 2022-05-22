from django.db import models
import uuid
from django.contrib.auth.models import User


# Create your models here.

class Preset(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, related_name="presets", on_delete=models.CASCADE)
    gender = models.CharField(max_length=20)
    aggressive_val = models.IntegerField()
    energetic_val = models.IntegerField()
    bias = models.IntegerField()

    class Meta:
        ordering = ['id']


class Game(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    replay_file = models.FileField(upload_to="replays")
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=255)
    user = models.ForeignKey(User, related_name="games", on_delete=models.CASCADE)
    is_public = models.BooleanField()
    processed_data = models.JSONField()
    league = models.CharField(max_length=50)
    year = models.IntegerField()
    round = models.CharField(max_length=50)
    match_group = models.CharField(max_length=50)

    class Meta:
        ordering = ['id']
