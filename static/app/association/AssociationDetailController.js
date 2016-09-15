(function () {
    'use strict';

    angular
        .module('yt')
        .controller('AssociationDetailController', AssociationDetailController)
        .controller('AssociationDetailModalController', AssociationDetailModalController);

    AssociationDetailController.$inject = ['ApiFactory', '$mdDialog', '$mdToast', '$state', '$stateParams', '$localStorage', '$mdSidenav', '$log'];
    AssociationDetailModalController.$inject = ['$stateParams', '$mdDialog', 'ApiFactory'];

    function AssociationDetailController(ApiFactory, $mdDialog, $mdToast, $state, $stateParams, $localStorage, $mdSidenav, $log) {
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
            $log.info($stateParams);
            vm.all = $localStorage.associations;
            ApiFactory.associations.get($stateParams.asscnId).then(function(asscn) {
                vm.association = asscn;
                $log.info(asscn);
            });
            ApiFactory.leagues.get($stateParams.asscnId).then(function(leagues) {
                vm.leagues = leagues;
                $log.info(leagues);
            });
        }

        activate();
    }

    function AssociationDetailModalController($stateParams, $mdDialog, ApiFactory) {
        var vm = this;
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
            ApiFactory.leagues.create(vm.league, $stateParams.leagueId).then(function(response) {
                console.log(response);
            })
        }
    }
})();