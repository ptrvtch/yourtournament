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
            vm.user = AuthFactory.getCurrentUser();
            console.log(vm.user);
            $translate.use('ru');
            tmhDynamicLocale.set('ru');
        };

        vm.activate();
    }
})();