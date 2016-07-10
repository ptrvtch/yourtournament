from rest_framework import viewsets, permissions
from rest_framework.decorators import list_route
from rest_framework.response import Response

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

    @list_route(
        methods=['get',],
        permission_classes=[permissions.IsAuthenticated,]
    )
    def my(self, request):
        queryset = self.queryset.filter(creator=request.user).order_by('created')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)