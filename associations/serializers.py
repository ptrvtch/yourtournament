from rest_framework import serializers

from associations.models import Association
from leagues.serializers import LeagueSerializer


class AssociationSerializer(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(
        many=False,
        read_only=True,
    )
    leagues = LeagueSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Association
        fields = ('id', 'name', 'description', 'creator', 'created', 'leagues')
