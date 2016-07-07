(function () {
    'use strict';

    angular
        .module('yt')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$uibModal', 'AuthFactory', '$localStorage'];

    function MainController($scope, $uibModal, AuthFactory, $localStorage) {
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
                templateUrl: '/static/register.html',
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
            })
        };

        vm.activate = function() {
            vm.user = $localStorage.user;
        };

        vm.activate();
    }
})();