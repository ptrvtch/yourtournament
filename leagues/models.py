from django.db import models


class League(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    asscn = models.ForeignKey('associations.Association', on_delete=models.CASCADE, related_name='leagues')
    name = models.CharField(max_length=40)
    description = models.CharField(
        blank=True,
        max_length=100
    )

    class Meta:
        ordering = ('name',)

    def __str__(self):
        return "{0} at {1}".format(self.name, self.asscn.name)
