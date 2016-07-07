(function () {
    'use strict';

    angular
        .module('yt', ['ngCookies', 'ngRoute', 'ngStorage', 'ui.bootstrap'])
        .config(config)
        .run(run);

    config.$inject = [
        '$interpolateProvider',
        '$locationProvider',
        '$routeProvider',
        '$httpProvider'
    ];

    function config($interpolateProvider,
                    $locationProvider,
                    $routeProvider,
                    $httpProvider
    ) {
        $interpolateProvider.startSymbol('{$');
        $interpolateProvider.endSymbol('$}');

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $routeProvider.when(
            '/register', {
                controller: 'AuthController',
                controllerAs: 'vm',
                templateUrl: '/static/register.html'
            }
        ).when(
            '/', {
                controller: 'MainController',
                controllerAs: 'vm',
                templateUrl: '/static/index.html'
            }
        )
            .otherwise('/');

        $httpProvider.interceptors.push([
            '$q',
            '$location',
            '$localStorage',
            function($q, $location, $localStorage) {
                return {
                    'request': function(config) {
                        config.headers = config.headers || {};
                        if ($localStorage.token) {
                            config.headers.Authorization = 'Bearer ' + $localStorage.token;
                        }
                        return config;
                    },
                    'responseError': function(response) {
                        if (response.status === 401 || response.status === 403) {
                            $location.path('/signin');
                        }
                        return $q.reject(response);
                    }
                }
            }
        ])
    }
    
    run.$inject = ['$http'];

    function run($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    }
})();