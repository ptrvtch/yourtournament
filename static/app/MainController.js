(function () {
    'use strict';

    angular
        .module('yt')
        .controller('MainController', MainController);

    MainController.$inject = ['$state', '$uibModal', 'AuthFactory', '$localStorage', '$translate'];

    function MainController($state, $uibModal, AuthFactory, $localStorage, $translate) {
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
            
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/static/app/auth/register.html',
                controller: 'AuthController',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    active: state
                }
            });

            modalInstance.result.then(function(data){
                vm.activate();
            })
        }

        vm.logout = function() {
            AuthFactory.logout().then(function() {
                vm.user = null;
                $localStorage.user = null;
                $state.go('main');
            })
        };

        vm.setLanguage = function() {
            $translate.use(vm.currentLanguage);
        }

        vm.activate = function() {
            vm.currentLanguage = 'ru';
            vm.user = $localStorage.user;
            if ($localStorage.user) {
                $state.go('myAssociations');
            }
        };

        vm.activate();
    }
})();