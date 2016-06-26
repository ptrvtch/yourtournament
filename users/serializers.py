from django.contrib.auth.models import User
from rest_framework import serializers, viewsets


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email')

