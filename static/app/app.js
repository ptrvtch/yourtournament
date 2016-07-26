(function () {
    'use strict';

    angular
        .module('yt', [
            'ngCookies',
            'ui.router',
            'ngStorage',
            'ui.bootstrap',
            'angular-loading-bar',
            'pascalprecht.translate',
            'ncy-angular-breadcrumb',
            'relativeDate',
            'tmh.dynamicLocale'
        ])
        .config(config)
        .run(run);

    config.$inject = [
        '$interpolateProvider',
        '$locationProvider',
        '$stateProvider',
        '$urlRouterProvider',
        '$httpProvider',
        'cfpLoadingBarProvider',
        '$translateProvider',
        'tmhDynamicLocaleProvider'
    ];

    function config($interpolateProvider,
                    $locationProvider,
                    $stateProvider,
                    $urlRouterProvider,
                    $httpProvider,
                    cfpLoadingBarProvider,
                    $translateProvider,
                    tmhDynamicLocaleProvider
    ) {
        $interpolateProvider.startSymbol('{$');
        $interpolateProvider.endSymbol('$}');

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('main', {
                url: '/',
                controller: 'MainController',
                controllerAs: 'vm',
                ncyBreadcrumb: {
                    label: 'Home'
                },
                views: {
                    'navbar': {
                        templateUrl: '/static/app/navbar.html',
                        controller: 'MainController as vm'
                    },
                    'content': {
                        templateUrl: '/static/app/index.html',
                        controller: 'MainController as vm'
                    },
                    'footer': {
                        templateUrl: '/static/app/footer.html',
                        controller: 'MainController as vm'
                    }
                }
            })
            .state('myProfile', {
                url: '/profile',ncyBreadcrumb: {
                    label: 'Profile'
                },
                views: {
                    'navbar': {
                        templateUrl: '/static/app/navbar.html',
                        controller: 'MainController as vm'
                    },
                    'content': {
                        templateUrl: '/static/app/auth/profile.html',
                        controller: 'MainController as vm'
                    },
                    'footer': {
                        templateUrl: '/static/app/footer.html',
                        controller: 'MainController as vm'
                    }
                }
            })
            .state('myAssociations', {
                url: '/associations',
                ncyBreadcrumb: {
                    label: 'Associations'
                },
                views: {
                    'navbar': {
                        templateUrl: '/static/app/navbar.html',
                        controller: 'MainController as vm'
                    },
                    'content': {
                        templateUrl: '/static/app/association/index.html',
                        controller: 'AssociationController as vm'
                    },
                    'footer': {
                        templateUrl: '/static/app/footer.html',
                        controller: 'MainController as vm'
                    }
                }
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
                            $location.path('/');
                        }
                        return $q.reject(response);
                    }
                }
            }
        ]);

        cfpLoadingBarProvider.includeSpinner = false;
        
        $translateProvider.useStaticFilesLoader({
            prefix: '/static/lang/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('ru');
        
        // Uncomment in production
        // $translateProvider.useLocalStorage();
        $translateProvider.useSanitizeValueStrategy('escape');
        $translateProvider.useMissingTranslationHandlerLog();

        tmhDynamicLocaleProvider.localeLocationPattern('/static/bower/angular-i18n/angular-locale_{$locale$}.js');
    }
    
    run.$inject = ['$http'];

    function run($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    }
})();