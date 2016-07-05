(function () {
    'use strict';

    angular
        .module('yt')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$uibModal'];

    function MainController($scope, $uibModal) {
        var vm = this;

        vm.openSignUp = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/static/register.html',
                controller: 'AuthController',
                controllerAs: 'vm',
                size: 'lg'
            });

            modalInstance.result.then(function(data){
                console.log(data);
            })
        }
    }
})();