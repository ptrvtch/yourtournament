from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from yourtour.tests.test_data import TestData, TestMethods


class AssociationTests(APITestCase):
    def test_create_association(self):
        url = reverse('association-list')
        user_data = TestData.user_data.copy()
        association_data = TestData.association_data.copy()
        user = TestMethods.create_user(**user_data)
        self.client.login(username=user.get_username(), password=user_data['password'])
        response = self.client.post(url, association_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['creator'], user.pk)

    def test_update_association(self):
        user_data = TestData.user_data.copy()
        association_data = TestData.association_data.copy()
        user = TestMethods.create_user(**user_data)
        association = TestMethods.create_association(user, **association_data)
        self.assertEqual(association.pk, 1)
        url = reverse('association-detail', args=(association.pk,))
        association_data['name'] = 'Changed name'
        self.client.login(username=user.get_username(), password=user_data['password'])
        response_get = self.client.get(url)
        self.assertEqual(response_get.status_code, status.HTTP_200_OK)
        response_put = self.client.put(url, data=association_data)
        self.assertEqual(response_put.status_code, status.HTTP_200_OK)
        self.assertEqual(response_put.data['name'], association_data['name'])
