(function () {
    'use strict';

    angular
        .module('yt')
        .controller('AssociationDetailController', AssociationDetailController)
        .controller('AssociationDetailModalController', AssociationDetailModalController);

    AssociationDetailController.$inject = ['ApiFactory', '$mdDialog', '$mdToast', '$state', '$stateParams', '$localStorage', '$mdSidenav'];
    AssociationDetailModalController.$inject = ['$stateParams', '$mdDialog', 'ApiFactory'];

    function AssociationDetailController(ApiFactory, $mdDialog, $mdToast, $state, $stateParams, $localStorage, $mdSidenav) {
        var vm = this;
        vm.toggleSideNav = toggleSideNav;
        vm.addLeague = addLeague;
        
        function toggleSideNav() {
            $mdSidenav('sidenav').toggle();
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
            ApiFactory.leagues.get($stateParams.id).then(function(leagues) {
                vm.leagues = leagues;
            });
            ApiFactory.associations.get().then(function(asscns) {
                vm.all = asscns;
                vm.association = asscns.$getRecord($stateParams.id);
                console.log(vm.association.leagues);
                console.log(vm.association);
            }, function(err) {
                console.warn(err);
            });
        }

        activate();
    }

    function AssociationDetailModalController($stateParams, $mdDialog, ApiFactory) {
        var vm = this;
        console.log(Association);
        vm.cancel = cancel;
        vm.addTeam = addTeam;
        vm.createLeague = createLeague;
        vm.league = {
            teams: []
        };
        vm.currentValue = '';

        function cancel() {
            $mdDialog.cancel('cancel');
        }

        function addTeam() {
            if (vm.league.teams.indexOf(vm.currentValue) == -1) {
                vm.league.teams.push(vm.currentValue);
                vm.currentValue = '';
            } else {
                vm.errorText = 'Team with this name already exists!'
            }
        }


        function createLeague() {
            ApiFactory.leagues.create(vm.league, $stateParams.id).then(function(response) {
                console.log(response);
            })
        }
    }
})();