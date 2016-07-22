from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from yourtour.tests.test_data import TestData, TestMethods

class LeagueTests(APITestCase):
    def test_can_create_league_for_own_asscn(self):
        url = reverse('league-list')
        user_data = TestData.user_data.copy()
        user = TestMethods.create_user(**user_data)
        association_data = TestData.association_data.copy()
        association = TestMethods.create_association(user, **association_data)
        league_data = TestData.league_data.copy()
        league_data['asscn'] = association.pk
        self.client.login(username=user.get_username(), password=user_data['password'])
        response = self.client.post(url, league_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_cannot_create_league_for_non_own_asscn(self):
        url = reverse('league-list')
        user_data1 = TestData.user_data.copy()
        user_data2 = TestData.user_data2.copy()
        user1 = TestMethods.create_user(**user_data1)
        user2 = TestMethods.create_user(**user_data2)
        asscn_data = TestData.association_data.copy()
        association1 = TestMethods.create_association(user1, **asscn_data)
        league_data = TestData.league_data.copy()
        league_data['asscn'] = association1.pk
        self.client.login(username=user2.get_username(), password=user_data2['password'])
        response = self.client.post(url, league_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
