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
            'ngMessages',
            'xeditable',
            'firebase',
            'mdDataTable'
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
                template: '<ui-view flex layout="column"/>',
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
                url: '/:asscnId',
                templateUrl: '/static/app/association/detail.html',
                controller: 'AssociationDetailController as vm',
                ncyBreadcrumb: {
                    label: "{$ vm.association.name $}",
                    parent: 'main.asscns.list'
                }
            })
            .state('main.asscns.league', {
                url: '/:asscnId/:leagueId',
                templateUrl: '/static/app/league/league.html',
                controller: 'LeagueController as vm',
                ncyBreadcrumb: {
                    label: "{$ vm.league.name $}",
                    parent: 'main.asscns.detail'
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
(function () {
    'use strict';

    angular
        .module('yt')
        .factory('ApiFactory', ApiFactory);

    ApiFactory.$inject = ['$q', '$firebaseObject', '$firebaseArray', '$firebaseAuth'];

    function ApiFactory($q, $firebaseObject, $firebaseArray, $firebaseAuth) {
        var uid = $firebaseAuth().$getAuth().uid;

        var userRef = firebase.database().ref('users/'+uid);
        var associationsRef = userRef.child("associations");
        var user = $firebaseObject(userRef);
        var asscns = $firebaseArray(associationsRef);

        var associations = {
            get: function(id) {
                if (id) {
                    var ref = associationsRef.child(id);
                    var asscn = $firebaseObject(ref);
                    return asscn.$loaded();
                }
                return asscns.$loaded();
            },
            create: function(data) {
                data.created = Date.now();
                return asscns.$add(data);
            },
            delete: function(asscn) {
                return asscns.$remove(asscn)
            },
            edit: function(asscn) {
                return asscns.$save(asscn)
            }
        };

        var leagues = {
            create: function(data, asscnId) {
                var leaguesRef = userRef.child("associations/"+asscnId+"/leagues/");
                var leagues = $firebaseArray(leaguesRef);
                return leagues.$add(data);
            },
            get: function(asscnId, leagueId) {
                var leaguesRef = userRef.child("associations/"+asscnId+"/leagues/");
                if (leagueId) {
                    var ref = leaguesRef.child(leagueId);
                    var league = $firebaseObject(ref);
                    return league.$loaded();
                }
                var leagues = $firebaseArray(leaguesRef);
                return leagues.$loaded();
            }
        };

        return {
            associations: associations,
            leagues: leagues
        }
    }
})();
(function () {
    'use strict';
    
    angular
        .module('yt')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$mdDialog', '$state', 'AuthFactory', '$localStorage'];

    function AuthController($mdDialog, $state, AuthFactory, $localStorage) {
        var vm = this;
        
        vm.signup = signup;
        vm.cancel = cancel;
        vm.signupValid = signupValid;

        function signup() {
            AuthFactory.login(vm.email, vm.password).then(function(user) {
                authSuccess(user);
            },
            function(errors) {
                if (errors.code == 'auth/user-not-found') {
                    AuthFactory.register(vm.email, vm.password).then(function(user){
                        authSuccess(user);
                    },
                    function(errors) {
                        console.log(errors);
                    })
                }
            })
        }

        function cancel() {
            $mdDialog.cancel('cancel');
        }

        function signupValid() {
            return (!vm.email || !vm.password);
        }

        function authSuccess(user) {
            vm.user = user;
            console.log(user);
            var currentUser = AuthFactory.getCurrentUser();
            $state.go('main.asscns.list');
            $mdDialog.hide();

        }

        function activate() {
            vm.authenticated = !!$localStorage.token;
        }

        activate();
    }
})();
(function () {
    'use strict';

    angular
        .module('yt')
        .controller('MainController', MainController);

    MainController.$inject = ['$state', '$mdDialog', 'AuthFactory', '$localStorage', '$translate', 'tmhDynamicLocale', '$scope'];

    function MainController($state, $mdDialog, AuthFactory, $localStorage, $translate, tmhDynamicLocale, $scope) {
        var vm = this;
        vm.languages = [
            {val: 'en', name: 'English'},
            {val: 'ru', name: 'Русский'}
        ];


        vm.openSignIn = function() {
            openModal(1);
        };

        vm.openSignUp = function() {
            openModal(0)
        };


        function openModal(state) {
            
            $mdDialog.show({
                templateUrl: '/static/app/auth/register.html',
                controller: 'AuthController as vm',
                clickOutsideToClose: true,
                escapeToClose: true,
                locals: {
                    active: state
                }
            });
        }

        vm.logout = function() {
            AuthFactory.logout();
            $state.go('main');

        };

        vm.isAuthenticated = function() {
            return !!AuthFactory.getCurrentUser();
        };

        vm.setLanguage = function(lang) {
            $translate.use(lang);
            tmhDynamicLocale.set(lang);
        };

        vm.activate = function() {
            var user = AuthFactory.getCurrentUser();
            if (user) {
                vm.user = AuthFactory.getCurrentUser().providerData[0];
            }
            $translate.use('ru');
            tmhDynamicLocale.set('ru');
        };

        vm.activate();
    }
})();
(function () {
    'use strict';

    angular
        .module('yt')
        .controller('AssociationController', AssociationController)
        .controller('AssociationModalController', AssociationModalController);

    AssociationController.$inject = ['ApiFactory', '$mdDialog', '$firebaseArray', '$mdToast', '$localStorage'];
    AssociationModalController.$inject = ['$mdDialog', 'toDelete', 'ApiFactory'];

    function AssociationController(ApiFactory, $mdDialog, $firebaseArray, $mdToast, $localStorage) {
        var vm = this;
        vm.createAssociation = createAssociation;
        vm.addNewAssociation = addNewAssociation;
        vm.cancel = cancel;
        vm.cancelEdit = cancelEdit;
        vm.deleteAssociation = deleteAssociation;
        vm.editAssociation = editAssociation;
        vm.storeAsscn = storeAsscn;

        function addNewAssociation() {
            vm.isAdding = true;
        }

        function showErrors(errors) {
            $mdToast.showSimple(errors.toString());
        }

        function editAssociation(association) {
            ApiFactory.associations.edit(association).then(function(response) {
                $mdToast.showSimple('Association changed!');
                console.log(response);
            }, showErrors)
        }

        function storeAsscn(asscn) {
            vm.editedAssociation = angular.copy(asscn);
        }
        
        function cancel () {
            vm.isAdding = false;
        }
        
        function cancelEdit() {
            vm.isEditing = false;
        }

        function createAssociation() {

            if (!vm.newAssociation.name || !vm.newAssociation.description) return;
            ApiFactory.associations.create(vm.newAssociation).then(function(response) {
                vm.isAdding = false;
                vm.newAssociation = {};
            }, showErrors)
        }


        function deleteAssociation(association) {
            vm.associationToDelete = association;
            $mdDialog.show({
                templateUrl: '/static/app/association/delete.html',
                controller: 'AssociationModalController as vm',
                clickOutsideToClose: true,
                escapeToClose: true,
                locals: {
                    toDelete: association
                }
            }).then(function(){
                getMyAssociations();
                $mdToast.showSimple('Association deleted!');
            });
        }

        function getMyAssociations() {
            ApiFactory.associations.get().then(function(response) {
                vm.associations = response;
                $localStorage.associations = vm.associations;
            })
        }

        function setTooltip(associations) {
            for (var i = 0; i < associations.length; i++) {
                var association = associations[i];
                association.leaguesNames = '';
                for (var j = 0; j < association.leagues.length; j++) {
                    if (j >= 3) {
                        var more = association.leagues.length - 3;
                        association.leaguesNames += (' and ' + more + ' more')
                        break;
                    }
                    association.leaguesNames += (association.leagues[j].name + ', ');
                }
            }
        }
        
        function activate() {
            vm.associationsLoaded = false;
            vm.isAdding = false;
            vm.newAssociation = {};
            getMyAssociations()
        }

        activate();
    }

    function AssociationModalController($mdDialog, toDelete, ApiFactory) {
        var vm = this;
        vm.confirmDelete = confirmDelete;
        vm.cancelDelete = cancelDelete;

        function confirmDelete() {
            ApiFactory.associations.delete(vm.associationToDelete).then(function(response) {
                $mdDialog.hide(response.data);
            }, function(errors) {
                console.error(errors.data);
            })
        }

        function cancelDelete() {
            $mdDialog.cancel('cancel');
        }

        function activate() {
            vm.associationToDelete = toDelete;
        }

        activate();

    }
})();
(function () {
    'use strict';

    angular
        .module('yt')
        .controller('AssociationDetailController', AssociationDetailController)
        .controller('AssociationDetailModalController', AssociationDetailModalController);

    AssociationDetailController.$inject = ['ApiFactory', '$mdDialog', '$mdToast', '$state', '$stateParams', '$localStorage', '$mdSidenav', '$log'];
    AssociationDetailModalController.$inject = ['$stateParams', '$mdDialog', 'ApiFactory'];

    function AssociationDetailController(ApiFactory, $mdDialog, $mdToast, $state, $stateParams, $localStorage, $mdSidenav, $log) {
        var vm = this;
        vm.toggleSideNav = toggleSideNav;
        vm.addLeague = addLeague;
        
        function toggleSideNav() {
            $mdSidenav('sidenav').toggle();
        }
        
        function addLeague(ev) {
            $mdDialog.show({
                templateUrl: '/static/app/association/addLeague.html',
                controller: 'AssociationDetailModalController as vm',
                targetEvent: ev,
                clickOutsideToClose: true,
                escapeToClose: true
            }).then(function(){
                $mdToast.showSimple('League added!');
            });
        }

        function activate() {
            $log.info($stateParams);
            vm.all = $localStorage.associations;
            ApiFactory.associations.get($stateParams.asscnId).then(function(asscn) {
                vm.association = asscn;
                $log.info(asscn);
            });
            ApiFactory.leagues.get($stateParams.asscnId).then(function(leagues) {
                vm.leagues = leagues;
                $log.info(leagues);
            });
        }

        activate();
    }

    function AssociationDetailModalController($stateParams, $mdDialog, ApiFactory) {
        var vm = this;
        vm.cancel = cancel;
        vm.addTeam = addTeam;
        vm.createLeague = createLeague;
        vm.league = {
            teams: []
        };
        vm.currentValue = '';

        function cancel() {
            $mdDialog.cancel('cancel');
        }

        function addTeam() {
            if (vm.league.teams.indexOf(vm.currentValue) == -1) {
                vm.league.teams.push(vm.currentValue);
                vm.currentValue = '';
            } else {
                vm.errorText = 'Team with this name already exists!'
            }
        }


        function createLeague() {
            ApiFactory.leagues.create(vm.league, $stateParams.leagueId).then(function(response) {
                console.log(response);
            })
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('yt')
        .controller('LeagueController', LeagueController);

    LeagueController.$inject = ['$q','ApiFactory', '$stateParams'];

    function LeagueController($q, ApiFactory, $stateParams) {
        var vm = this;

        function activate() {
            $q.all([
                ApiFactory.associations.get($stateParams['asscnId']),
                ApiFactory.leagues.get($stateParams['asscnId'], $stateParams['leagueId'])
            ]).then(function(result) {
                vm.association = result[0];
                vm.league = result[1];
            })
        }

        activate();
    }
})();