from django.db import models
from enum import Enum


class ItemType(Enum):
    ST = 'Short Term'
    LT = 'Long Term'


class Item(models.Model):
    type = models.CharField(
        'type',
        max_length=2,
        choices=[(tag.name, tag.value) for tag in ItemType]
    )
    descr = models.CharField(
        'item description',
        max_length=64
    )

    def __str__(self):
        return(self.descr)
