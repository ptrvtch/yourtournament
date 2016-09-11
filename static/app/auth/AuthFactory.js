(function () {
    'use strict';
    
    angular
        .module('yt')
        .factory('AuthFactory', AuthFactory);

    AuthFactory.$inject = ['$localStorage', '$http', '$firebaseAuth'];

    function AuthFactory($localStorage, $http, $firebaseAuth) {
        var Auth = $firebaseAuth();
        function register(email, password) {
            return Auth.$createUserWithEmailAndPassword(email, password)
        }

        function login(email, password) {
            return Auth.$signInWithEmailAndPassword(email, password)
        }

        function logout() {
            return Auth.$signOut();
        }

        function getCurrentUser() {
            return Auth.$getAuth();
        }

        return {
            register: register,
            login: login,
            logout: logout,
            getCurrentUser: getCurrentUser
        }
    }
})();