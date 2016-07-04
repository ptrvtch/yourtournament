from django.contrib.auth.models import User
from rest_framework import serializers, viewsets


class UserSerializer(serializers.HyperlinkedModelSerializer):
    associations = serializers.HyperlinkedRelatedField(
        many=True,
        read_only=True,
        view_name='association-detail',
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'url', 'associations')

