(function () {
    'use strict';
    
    angular
        .module('yt')
        .factory('AuthFactory', AuthFactory);

    AuthFactory.$inject = ['$cookies', '$http'];

    function AuthFactory($cookies, $http) {
        function register(email, username, password) {
            return $http.post('/api/users/', {
                "username": username,
                "email": email,
                "password": password
            })
        }

        return {
            register: register
        }
    }
})();