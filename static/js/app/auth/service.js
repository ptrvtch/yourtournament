(function () {
    'use strict';
    
    angular
        .module('yt')
        .factory('AuthFactory', AuthFactory);

    AuthFactory.$inject = ['$cookies', '$http'];

    function AuthFactory($cookies, $http) {
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

        return {
            register: register,
            login: login
        }
    }
})();