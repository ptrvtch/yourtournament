from rest_framework import viewsets, permissions, status
from rest_framework.decorators import list_route
from rest_framework.response import Response

from leagues.models import League
from leagues.permissions import IsLeagueOwner
from leagues.serializers import LeagueSerializer


class LeagueViewSet(viewsets.ModelViewSet):
    queryset = League.objects.all()
    serializer_class = LeagueSerializer
    permission_classes = (IsLeagueOwner,)
