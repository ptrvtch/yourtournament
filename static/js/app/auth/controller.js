(function () {
    'use strict';
    
    angular
        .module('yt')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$uibModalInstance', '$scope', 'AuthFactory'];

    function AuthController($uibModalInstance, $scope, AuthFactory) {
        var vm = this;
        
        vm.signup = signup;
        vm.cancel = cancel;
        vm.signupValid = signupValid;
        vm.login = login;

        function signup() {
            AuthFactory.register(vm.email, vm.username, vm.password1, vm.password2).then(function(response) {
                 $uibModalInstance.close(response.data);
            },
            function(errors) {
                console.log(errors.data);
                processErrors(errors.data);
            })
        }
        
        function login() {
            AuthFactory.login(vm.username, vm.password).then(function(response) {
                $uibModalInstance.close(response.data);
            },
            function(errors) {
                console.log(errors.data);
                processErrors(errors.data);
            })
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
        
        function processErrors(errorsData) {
            vm.errors = errorsData;
            if (errorsData["non_field_errors"])
                vm.non_field_errors = errorsData["non_field_errors"].toString();
        }

        function signupValid() {
            return (!((vm.password1 != vm.password2) || !vm.email || !vm.username));
        }
    }
})();