(function () {
    'use strict';

    angular
        .module('yt')
        .controller('AssociationController', AssociationController);

    AssociationController.$inject = ['ApiFactory'];

    function AssociationController(ApiFactory) {
        var vm = this;
        vm.createAssociation = createAssociation;
        vm.addNewAssociation = addNewAssociation;
        vm.cancel = cancel;

        function addNewAssociation() {
            vm.isCreating = true;
            vm.newAssociation = {};
        }
        
        function cancel () {
            vm.isCreating = false;
        }

        function createAssociation() {
            ApiFactory.createAssociation(vm.newAssociation).then(function(response) {
                vm.associations.push({
                    "name": response.data['name'],
                    "description": response.data['description']
                });
                vm.isCreating = false;
            }, function(errors) {
                console.log(errors.data);
            })
        }

        function getMyAssociations() {
            ApiFactory.getMyAssociations().then(function(response) {
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
})();