(function () {
    'use strict';

    angular
        .module('yt')
        .factory('ApiFactory', ApiFactory);

    ApiFactory.$inject = ['$q', '$firebaseObject', '$firebaseArray', '$firebaseAuth'];

    function ApiFactory($q, $firebaseObject, $firebaseArray, $firebaseAuth) {
        var uid = $firebaseAuth().$getAuth().uid;

        var userRef = firebase.database().ref('users/'+uid);
        var associationsRef = userRef.child("associations");
        var user = $firebaseObject(userRef);
        var asscns = $firebaseArray(associationsRef);

        var associations = {
            get: function(id) {
                if (id) {
                    var ref = associationsRef.child(id);
                    var asscn = $firebaseObject(ref);
                    return asscn.$loaded();
                }
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
            get: function(asscnId, leagueId) {
                var leaguesRef = userRef.child("associations/"+asscnId+"/leagues/");
                if (leagueId) {
                    var ref = leaguesRef.child(leagueId);
                    var league = $firebaseObject(ref);
                    return league.$loaded();
                }
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