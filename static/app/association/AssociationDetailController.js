(function () {
    'use strict';

    angular
        .module('yt')
        .controller('AssociationDetailController', AssociationDetailController);

    AssociationDetailController.$inject = ['ApiFactory', '$uibModal', '$scope', '$state', '$stateParams', '$localStorage'];

    function AssociationDetailController(ApiFactory, $uibModal, $scope, $state, $stateParams, $localStorage) {
        var vm = this;
        vm.cancel = cancel;
        vm.cancelEdit = cancelEdit;
        vm.deleteAssociation = deleteAssociation;
        vm.editAssociation = editAssociation;
        vm.confirmEditAssociation = confirmEditAssociation;

        function editAssociation(association) {

        }

        function confirmEditAssociation() {

        }

        function cancel () {
            
        }

        function cancelEdit() {
            
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
})();