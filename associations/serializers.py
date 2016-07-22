from rest_framework import serializers

from associations.models import Association


class AssociationSerializer(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(
        many=False,
        read_only=True,
    )
    leagues = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=True
    )

    class Meta:
        model = Association
        fields = ('id', 'name', 'description', 'creator', 'created', 'leagues')
