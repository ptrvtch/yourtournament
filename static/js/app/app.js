(function () {
    'use strict';

    angular
        .module('yt', ['ngCookies', 'ngRoute', 'ui.bootstrap'])
        .config(config)
        .run(run);

    config.$inject = ['$interpolateProvider', '$locationProvider', '$routeProvider'];

    function config($interpolateProvider, $locationProvider, $routeProvider) {
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
    }
    
    run.$inject = ['$http'];

    function run($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    }
})();