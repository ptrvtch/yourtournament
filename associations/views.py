from rest_framework import viewsets, permissions

from associations.models import Association
from associations.permissions import IsOwnerOrReadOnly
from associations.serializers import AssociationSerializer


class AssociationViewSet(viewsets.ModelViewSet):
    queryset = Association.objects.all()
    serializer_class = AssociationSerializer
    permission_classes = (
        permissions.IsAuthenticatedOrReadOnly,
        IsOwnerOrReadOnly,
    )

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
