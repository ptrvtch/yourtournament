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