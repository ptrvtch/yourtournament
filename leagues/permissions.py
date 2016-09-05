from django.contrib.auth.models import User
from rest_framework import permissions

from associations.models import Association
from associations.serializers import AssociationSerializer
from users.serializers import UserSerializer


class IsLeagueOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        user_id = getattr(request.user, 'id')
        asscn_id = request.data.get('asscn')
        if asscn_id is not None:
            association = Association.objects.get(id=asscn_id)
            serialized = AssociationSerializer(association)
            return user_id == serialized.data['creator']
        return False


    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.asscn.creator == request.user
