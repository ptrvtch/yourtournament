(function () {
    'use strict';

    angular
        .module('yt')
        .controller('AssociationController', AssociationController)
        .controller('AssociationModalController', AssociationModalController);

    AssociationController.$inject = ['ApiFactory', '$mdDialog', '$firebaseArray', '$mdToast', '$localStorage'];
    AssociationModalController.$inject = ['$mdDialog', 'toDelete', 'ApiFactory'];

    function AssociationController(ApiFactory, $mdDialog, $firebaseArray, $mdToast, $localStorage) {
        var vm = this;
        vm.createAssociation = createAssociation;
        vm.addNewAssociation = addNewAssociation;
        vm.cancel = cancel;
        vm.cancelEdit = cancelEdit;
        vm.deleteAssociation = deleteAssociation;
        vm.editAssociation = editAssociation;
        vm.storeAsscn = storeAsscn;

        function addNewAssociation() {
            vm.isAdding = true;
        }

        function showErrors(errors) {
            $mdToast.showSimple(errors.toString());
        }

        function editAssociation(association) {
            ApiFactory.associations.edit(association).then(function(response) {
                $mdToast.showSimple('Association changed!');
                console.log(response);
            }, showErrors)
        }

        function storeAsscn(asscn) {
            vm.editedAssociation = angular.copy(asscn);
        }
        
        function cancel () {
            vm.isAdding = false;
        }
        
        function cancelEdit() {
            vm.isEditing = false;
        }

        function createAssociation() {

            if (!vm.newAssociation.name || !vm.newAssociation.description) return;
            ApiFactory.associations.create(vm.newAssociation).then(function(response) {
                vm.isAdding = false;
                vm.newAssociation = {};
            }, showErrors)
        }


        function deleteAssociation(association) {
            vm.associationToDelete = association;
            $mdDialog.show({
                templateUrl: '/static/app/association/delete.html',
                controller: 'AssociationModalController as vm',
                clickOutsideToClose: true,
                escapeToClose: true,
                locals: {
                    toDelete: association
                }
            }).then(function(){
                getMyAssociations();
                $mdToast.showSimple('Association deleted!');
            });
        }

        function getMyAssociations() {
            ApiFactory.associations.get().then(function(response) {
                vm.associations = response;
                $localStorage.associations = vm.associations;
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
            vm.isAdding = false;
            vm.newAssociation = {};
            getMyAssociations()
        }

        activate();
    }

    function AssociationModalController($mdDialog, toDelete, ApiFactory) {
        var vm = this;
        vm.confirmDelete = confirmDelete;
        vm.cancelDelete = cancelDelete;

        function confirmDelete() {
            ApiFactory.associations.delete(vm.associationToDelete).then(function(response) {
                $mdDialog.hide(response.data);
            }, function(errors) {
                console.error(errors.data);
            })
        }

        function cancelDelete() {
            $mdDialog.cancel('cancel');
        }

        function activate() {
            vm.associationToDelete = toDelete;
        }

        activate();

    }
})();