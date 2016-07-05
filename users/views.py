from django.contrib.auth.models import User
from django.views.generic import TemplateView
from rest_framework import status
from rest_framework import viewsets
from users.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class IndexView(TemplateView):
    template_name = 'base.html'
