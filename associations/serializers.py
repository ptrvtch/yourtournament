from rest_framework import serializers

from associations.models import Association


class AssociationSerializer(serializers.ModelSerializer):
    creator = serializers.HyperlinkedRelatedField(
        many=False,
        read_only=True,
        view_name='user-detail'
    )

    class Meta:
        model = Association
        fields = ('id', 'name', 'description', 'creator', )
