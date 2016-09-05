(function () {
    'use strict';

    angular
        .module('yt')
        .controller('AssociationDetailController', AssociationDetailController)
        .controller('AssociationDetailModalController', AssociationDetailModalController);

    AssociationDetailController.$inject = ['ApiFactory', '$mdDialog', '$scope', '$state', '$stateParams', '$localStorage', '$mdSidenav'];
    AssociationDetailModalController.$inject = ['ApiFactory', '$mdDialog'];

    function AssociationDetailController(ApiFactory, $mdDialog, $scope, $state, $stateParams, $localStorage, $mdSidenav) {
        var vm = this;
        vm.toggleSideNav = toggleSideNav;
        vm.addLeague = addLeague;
        
        function toggleSideNav() {
            $mdSidenav('sidenav').toggle();
        }


        function deleteAssociation(association) {
            vm.associationToDelete = association;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/static/app/association/delete.html',
                controller: 'AssociationModalController as vm',
                size: 'md',
                resolve: {
                    toDelete: association
                }
            });

            modalInstance.result.then(function(response) {
                $state.go('main.asscns.list');
            })
        }
        
        function addLeague(ev) {
            $mdDialog.show({
                templateUrl: '/static/app/association/addLeague.html',
                controller: 'AssociationDetailModalController as vm',
                targetEvent: ev,
                clickOutsideToClose: true,
                escapeToClose: true
            }).then(function(){
                $mdToast.showSimple('League added!');
            });
        }

        function activate() {
            vm.all = $localStorage.associations;
            ApiFactory.associations.get($stateParams.id).then(function(res) {
                vm.association = res.data;
            }, function(err) {
                console.warn(err);
            });
        }

        activate();
    }

    function AssociationDetailModalController(ApiFactory, $mdDialog) {
        var vm = this;
        vm.cancel = cancel;
        vm.create = create;

        function cancel() {
            $mdDialog.cancel('cancel');
        }

        function create() {
            
        }
    }
})();