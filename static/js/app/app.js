(function () {
    'use strict';

    angular
        .module('yt', ['ngCookies', 'ui.router', 'ngStorage', 'ui.bootstrap'])
        .config(config)
        .run(run);

    config.$inject = [
        '$interpolateProvider',
        '$locationProvider',
        '$stateProvider',
        '$urlRouterProvider',
        '$httpProvider'
    ];

    function config($interpolateProvider,
                    $locationProvider,
                    $stateProvider,
                    $urlRouterProvider,
                    $httpProvider
    ) {
        $interpolateProvider.startSymbol('{$');
        $interpolateProvider.endSymbol('$}');

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        // $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('main', {
                url: '/',
                controller: 'MainController',
                controllerAS: 'vm',
                views: {
                    'navbar': {
                        templateUrl: '/static/navbar.html',
                        controller: 'MainController as vm'
                    },
                    'content': {
                        templateUrl: '/static/index.html',
                        controller: 'MainController as vm'
                    }
                }
            })
            .state('auth', {
                url: '/register',
                templateUrl: '/static/register.html',
                controller: 'AuthController',
                controllerAS: 'vm'
            });

        $httpProvider.interceptors.push([
            '$q',
            '$location',
            '$localStorage',
            function($q, $location, $localStorage) {
                return {
                    'request': function(config) {
                        config.headers = config.headers || {};
                        if ($localStorage.token) {
                            config.headers.Authorization = 'Token ' + $localStorage.token;
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