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

        function addNewAssociation() {
            vm.isCreating = true;
            vm.newAssociation = {};
        }

        function createAssociation() {
            console.log(vm.newAssociation);
            ApiFactory.createAssociation(vm.newAssociation).then(function(response) {
                vm.associations.push({
                    "name": response.data['name'],
                    "description": response.data['description']
                })
            }, function(errors) {
                console.log(errors.data);
            })
        }

        function getMyAssociations() {
            ApiFactory.getMyAssociations().then(function(response) {
                vm.associations = response.data;
            })
        }
        
        function activate() {
            getMyAssociations()
        }

        activate();
    }
})();