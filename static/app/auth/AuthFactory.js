(function () {
    'use strict';
    
    angular
        .module('yt')
        .factory('AuthFactory', AuthFactory);

    AuthFactory.$inject = ['$localStorage', '$http'];

    function AuthFactory($localStorage, $http) {
        function register(email, username, password1, password2) {
            return $http.post('/rest-auth/registration/', {
                "username": username,
                "email": email,
                "password1": password1,
                "password2": password2
            })
        }

        function login(username, password) {
            return $http.post('/rest-auth/login/', {
                "username": username,
                "password": password
            })
        }

        function logout() {
            delete $localStorage.token;
            return $http.post('/rest-auth/logout/');
        }

        function getCurrentUser() {
            return $http.get('/rest-auth/user/');
        }

        return {
            register: register,
            login: login,
            logout: logout,
            getCurrentUser: getCurrentUser
        }
    }
})();