from django.db import models


# Create your models here.

# class Preset(models.Model):
#     id = models.IntegerField()
#     userid = models.IntegerField()
#     gender = models.CharField(max_length=255)
#     aggressiveVal = models.IntegerField()
#     energeticVal = models.IntegerField()
#     bias = models.IntegerField()
#
#     # PRIMARY KEY (id),
#     # FOREIGN KEY (userid) REFERENCES auth_user(id)
#
# class Game(models.Model):
#     id = models.IntegerField()
#     # logfile
#     userid = models.IntegerField()
#     isPublic = models.BooleanField()
#     jasminLink = models.CharField(max_length=255)
#     league = models.CharField(max_length=255)
#     year = models.IntegerField()
#     round = models.CharField(max_length=255)
#     matchGroup = models.CharField(max_length=255)
#
#     # PRIMARY KEY (id),
#     # FOREIGN KEY (userid) REFERENCES auth_user(id)