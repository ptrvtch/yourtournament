(function () {
    'use strict';

    angular
        .module('yt')
        .controller('AssociationController', AssociationController)
        .controller('AssociationModalController', AssociationModalController);

    AssociationController.$inject = ['ApiFactory', '$uibModal'];
    AssociationModalController.$inject = ['$uibModalInstance', 'toDelete', 'ApiFactory'];

    function AssociationController(ApiFactory, $uibModal, $uibModalInstance) {
        var vm = this;
        vm.createAssociation = createAssociation;
        vm.addNewAssociation = addNewAssociation;
        vm.cancel = cancel;
        vm.cancelEdit = cancelEdit;
        vm.cancelDelete = cancelDelete;
        vm.deleteAssociation = deleteAssociation;
        vm.editAssociation = editAssociation;
        vm.confirmEditAssociation = confirmEditAssociation;

        function addNewAssociation() {
            vm.newAssociation = {};
            vm.isCreating = true;
        }

        function editAssociation(association) {
            vm.editedAssociation = {
                name: association['name'],
                description: association['description'],
                id: association['id']
            };
            vm.isEditing = true;
        }

        function confirmEditAssociation() {
            var data = {
                name: vm.editedAssociation.name,
                description: vm.editedAssociation.description
            };
            ApiFactory.associations.edit(vm.editedAssociation.id, data).then(function(response) {
                vm.isEditing = false;
                getMyAssociations();
            }, function(errors) {
                console.log(errors.data);
            })
        }
        
        function cancel () {
            vm.isCreating = false;
        }
        
        function cancelEdit() {
            vm.isEditing = false;
        }

        function cancelDelete() {
            $uibModalInstance.dismiss('cancel');
        }

        function createAssociation() {
            ApiFactory.associations.create(vm.newAssociation).then(function(response) {
                vm.associations.push({
                    "id": response.data['id'],
                    "name": response.data['name'],
                    "description": response.data['description']
                });
                vm.isCreating = false;
            }, function(errors) {
                console.log(errors.data);
            })
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
                getMyAssociations();
            })
        }

        function getMyAssociations() {
            ApiFactory.associations.get().then(function(response) {
                vm.associations = response.data;
                vm.associationsLoaded = true;
            })
        }
        
        function activate() {
            vm.associationsLoaded = false;
            getMyAssociations()
        }

        activate();
    }

    function AssociationModalController($uibModalInstance, toDelete, ApiFactory) {
        var vm = this;
        vm.confirmDelete = confirmDelete;
        vm.cancelDelete = cancelDelete;

        function confirmDelete() {
            ApiFactory.associations.delete(vm.associationToDelete.id).then(function(response) {
                console.log(response.data);
                $uibModalInstance.close(response.data);
            }, function(errors) {
                console.log(errors.data);
            })
        }

        function cancelDelete() {
            $uibModalInstance.dismiss('cancel');
        }

        function activate() {
            vm.associationToDelete = toDelete;
        }

        activate();

    }
})();