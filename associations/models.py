from django.db import models
from django.contrib.auth.models import User


class Association(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(User, related_name='associations')
    name = models.CharField(max_length=40)
    description = models.CharField(
        blank=True,
        max_length=500
    )

    class Meta:
        ordering = ('name',)

    def __str__(self):
        return "{0} by {1}".format(self.name, self.creator.username)
