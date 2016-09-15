(function () {
    'use strict';

    angular
        .module('yt')
        .factory('ApiFactory', ApiFactory);

    ApiFactory.$inject = ['$firebaseObject', '$firebaseArray', '$firebaseAuth'];

    function ApiFactory($firebaseObject, $firebaseArray, $firebaseAuth) {
        var uid = $firebaseAuth().$getAuth().uid;

        var userRef = firebase.database().ref('users/'+uid);
        var associationsRef = userRef.child("associations");
        var user = $firebaseObject(userRef);
        var asscns = $firebaseArray(associationsRef);

        var associations = {
            get: function() {
                return asscns.$loaded();
            },
            create: function(data) {
                data.created = Date.now();
                return asscns.$add(data);
            },
            delete: function(asscn) {
                return asscns.$remove(asscn)
            },
            edit: function(asscn) {
                return asscns.$save(asscn)
            }
        };

        var leagues = {
            create: function(data, asscnId) {
                var leaguesRef = userRef.child("associations/"+asscnId+"/leagues/");
                var leagues = $firebaseArray(leaguesRef);
                return leagues.$add(data);
            },
            get: function(asscnId) {
                var leaguesRef = userRef.child("associations/"+asscnId+"/leagues/");
                var leagues = $firebaseArray(leaguesRef);
                return leagues.$loaded();
            }
        };

        return {
            associations: associations,
            leagues: leagues
        }
    }
})();