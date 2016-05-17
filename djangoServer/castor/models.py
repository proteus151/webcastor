from django.db import models
from djangotoolbox.fields import ListField

class SwitchPort(models.Model):
    port = models.CharField(max_length=32, unique=True)
    enabled = models.BooleanField(default=False)
    customer = models.CharField(max_length=200)
    router = models.GenericIPAddressField()
    notes = models.TextField()
    device = models.CharField(max_length=80)
    peers = ListField(models.CharField(max_length=32))
    class MongoMeta:
        indexes = [ [ ('port',1) ] ]

