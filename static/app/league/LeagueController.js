(function () {
    'use strict';

    angular
        .module('yt')
        .controller('LeagueController', LeagueController);

    LeagueController.$inject = ['$q','ApiFactory', '$stateParams'];

    function LeagueController($q, ApiFactory, $stateParams) {
        var vm = this;

        function activate() {
            $q.all([
                ApiFactory.associations.get($stateParams['asscnId']),
                ApiFactory.leagues.get($stateParams['asscnId'], $stateParams['leagueId'])
            ]).then(function(result) {
                vm.association = result[0];
                vm.league = result[1];
            })
        }

        activate();
    }
})();