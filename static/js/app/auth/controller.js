(function () {
    'use strict';
    
    angular
        .module('yt')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$uibModalInstance', '$scope', 'AuthFactory'];

    function AuthController($uibModalInstance, $scope, AuthFactory) {
        var vm = this;
        
        vm.register = register;
        // vm.ok = ok;
        vm.cancel = cancel;

        function register() {
            console.log('registered');
            $uibModalInstance.close('registered');
            AuthFactory.register(vm.email, vm.username, vm.password1, vm.password2).then(function(response) {
                 $uibModalInstance.close(response.data);
            },
            function(errors) {
                console.log(errors.data);
            })
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();