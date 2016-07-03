(function () {
    'use strict';
    
    angular
        .module('yt')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$location', '$scope', 'AuthFactory'];

    function AuthController($location, $scope, AuthFactory) {
        var vm = this;
        
        vm.register = register;

        function register() {
            console.log(vm.email, vm.username, vm.password);
            AuthFactory.register(vm.email, vm.username, vm.password).then(function(response) {
                console.log(response.data);
            })
        }
    }
})();