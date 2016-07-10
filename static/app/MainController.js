(function () {
    'use strict';

    angular
        .module('yt')
        .controller('MainController', MainController);

    MainController.$inject = ['$state', '$uibModal', 'AuthFactory', '$localStorage'];

    function MainController($state, $uibModal, AuthFactory, $localStorage) {
        var vm = this;

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

        vm.activate = function() {
            vm.user = $localStorage.user;
            if ($localStorage.user) {
                $state.go('myAssociations');
            }
        };

        vm.activate();
    }
})();