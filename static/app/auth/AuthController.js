(function () {
    'use strict';
    
    angular
        .module('yt')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$uibModalInstance', '$scope', 'AuthFactory', '$localStorage', 'active'];

    function AuthController($uibModalInstance, $scope, AuthFactory, $localStorage, active) {
        var vm = this;
        
        vm.signup = signup;
        vm.cancel = cancel;
        vm.signupValid = signupValid;
        vm.login = login;
        vm.active = active;

        function signup() {
            AuthFactory.register(vm.email, vm.username, vm.password1, vm.password2).then(function(response) {
                authSuccess(response.data);
            },
            function(errors) {
                console.log(errors.data);
                processErrors(errors.data);
            })
        }
        
        function login() {
            AuthFactory.login(vm.username, vm.password).then(function(response) {
                authSuccess(response.data);
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

        function authSuccess(data) {
            $localStorage.token = data.key;
            AuthFactory.getCurrentUser().then(function(res){
                $localStorage.user = res.data;
                $uibModalInstance.close($localStorage.user);
            })
        }

        function activate() {
            vm.authenticated = !!$localStorage.token;
        }

        activate();
    }
})();