from django.contrib.auth.models import User

from associations.models import Association


class TestData(object):
    user_data = {
        'username': 'testusername',
        'email': 'testusername@mail.com',
        'password': 'yourtour',
        'first_name': 'TestName',
        'last_name': 'TestLastname',
        'is_active': True,
    }

    user_data2 = {

        'username': 'testusername2',
        'email': 'testusername2@mail.com',
        'password': 'yourtour2',
        'first_name': 'TestName2',
        'last_name': 'TestLastname2',
        'is_active': True,

    }

    association_data = {
        'name': 'Test Association',
        'description': 'Test description'
    }


class TestMethods(object):
    @classmethod
    def create_user(cls, **credentials):
        user = User.objects.create(**credentials)
        user.set_password(credentials.get('password', None))
        if credentials['is_active']:
            cls.activate_user(user)
        return user

    @classmethod
    def create_association(cls, user, **data):
        association = Association.objects.create(creator=user, **data)
        return association


    @classmethod
    def activate_user(cls, user):
        user.is_active = True
        user.save()
