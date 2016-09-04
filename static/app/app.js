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
            'tmh.dynamicLocale',
            'ngMaterial',
            'xeditable',
            'firebase'
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
        'tmhDynamicLocaleProvider',
        '$breadcrumbProvider'
    ];

    function config($interpolateProvider,
                    $locationProvider,
                    $stateProvider,
                    $urlRouterProvider,
                    $httpProvider,
                    cfpLoadingBarProvider,
                    $translateProvider,
                    tmhDynamicLocaleProvider,
                    $breadcrumbProvider
    ) {
        $interpolateProvider.startSymbol('{$');
        $interpolateProvider.endSymbol('$}');

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('main', {
                abstract: true,
                templateUrl: '/static/app/main.html',
                controller: 'MainController as vm'
            })
            .state('main.index', {
                url: '/',
                templateUrl: '/static/app/index.html',
                ncyBreadcrumb: {
                    label: "{$ 'ncy.homepage' | translate $}"
                }
            })
            .state('main.asscns', {
                abstract: true,
                url: '/associations',
                template: '<ui-view/>',
                ncyBreadcrumb: {
                    skip: true
                }
            })
            .state('main.asscns.list', {
                url: '/all',
                templateUrl: '/static/app/association/index.html',
                controller: 'AssociationController as vm',
                ncyBreadcrumb: {
                    label: "{$ 'ncy.asscns' | translate $}",
                    parent: 'main.index'
                }
            })
            .state('main.asscns.detail', {
                url: '/:id',
                templateUrl: '/static/app/association/detail.html',
                controller: 'AssociationDetailController as vm',
                ncyBreadcrumb: {
                    label: "{$ vm.association.name $}",
                    parent: 'main.asscns.list'
                }
            })
            .state('main.profile', {
                url: '/profile',
                ncyBreadcrumb: {
                    label: "{$ 'ncy.profile' | translate $}",
                    parent :'main.index'
                },
                templateUrl: '/static/app/auth/profile.html'
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
                            $localStorage.user = null;
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

        $breadcrumbProvider.setOptions({
            templateUrl: '/static/app/breadcrumbs.html'
        });
    }
    
    run.$inject = ['$http', 'editableOptions', 'editableThemes'];

    function run($http, editableOptions, editableThemes) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';

        editableOptions.theme = 'default';
    }
})();