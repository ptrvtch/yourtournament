(function () {
    'use strict';

    angular
        .module('yt')
        .controller('AssociationController', AssociationController)
        .controller('AssociationModalController', AssociationModalController);

    AssociationController.$inject = ['ApiFactory', '$uibModal', '$localStorage', '$mdToast'];
    AssociationModalController.$inject = ['$uibModalInstance', 'toDelete', 'ApiFactory'];

    function AssociationController(ApiFactory, $uibModal, $localStorage, $mdToast) {
        var vm = this;
        vm.createAssociation = createAssociation;
        vm.addNewAssociation = addNewAssociation;
        vm.cancel = cancel;
        vm.cancelEdit = cancelEdit;
        vm.deleteAssociation = deleteAssociation;
        vm.editAssociation = editAssociation;

        function addNewAssociation() {
            vm.newAssociation = {};
            vm.isEditing = false;
            vm.isCreating = true;
        }

        function editAssociation(association) {
            var data = {
                name: association.name,
                description: association.description
            };
            ApiFactory.associations.edit(association.id, data).then(function(response) {
                $mdToast.showSimple('Association changed!');
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

        function createAssociation() {
            ApiFactory.associations.create(vm.newAssociation).then(function(response) {
                vm.associations.push({
                    "id": response.data['id'],
                    "name": response.data['name'],
                    "created": response.data['created'],
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
                $localStorage.associations = response.data;
                setTooltip(vm.associations);
                vm.associationsLoaded = true;
            })
        }

        function setTooltip(associations) {
            for (var i = 0; i < associations.length; i++) {
                var association = associations[i];
                association.leaguesNames = '';
                for (var j = 0; j < association.leagues.length; j++) {
                    if (j >= 3) {
                        var more = association.leagues.length - 3;
                        association.leaguesNames += (' and ' + more + ' more')
                        break;
                    }
                    association.leaguesNames += (association.leagues[j].name + ', ');
                }
            }
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