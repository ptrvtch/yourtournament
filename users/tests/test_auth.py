from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from yourtour.tests.test_data import TestData, TestMethods


class AuthTests(APITestCase):
    def test_create_account(self):
        url = reverse('rest_register')
        user_data = TestData.user_data.copy()
        user_data['password1'] = user_data['password']
        user_data['password2'] = user_data['password']
        response = self.client.post(url, user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_account_duplicate_username(self):
        url = reverse('rest_register')
        user_data = TestData.user_data.copy()
        user = TestMethods.create_user(**user_data)
        user_data2 = TestData.user_data2.copy()
        user_data2['username'] = user.username
        response = self.client.post(url, user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_account_duplicate_email(self):
        url = reverse('rest_register')

        user_data = TestData.user_data.copy()
        user = TestMethods.create_user(**user_data)
        user_data2 = TestData.user_data2.copy()
        user_data2['email'] = user.email
        response = self.client.post(url, user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_active_user_can_login(self):
        url = reverse('rest_login')
        user_data = TestData.user_data.copy()
        user = TestMethods.create_user(**user_data)
        logged_in = self.client.login(username=user.get_username(), password=user_data['password'])
        self.assertTrue(logged_in)

    def test_inactive_user_cannot_login(self):
        url = reverse('rest_login')
        user_data = TestData.user_data.copy()
        user_data['is_active'] = False
        user = TestMethods.create_user(**user_data)
        logged_in = self.client.login(username=user.get_username(), password=user_data['password'])
        self.assertFalse(logged_in)
