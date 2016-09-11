(function () {
    'use strict';

    angular
        .module('yt')
        .factory('ApiFactory', ApiFactory);

    ApiFactory.$inject = ['$firebaseObject', '$firebaseArray', '$firebaseAuth'];

    function ApiFactory($firebaseObject, $firebaseArray, $firebaseAuth) {
        var uid = $firebaseAuth().$getAuth().uid;
        var user = $firebaseObject(firebase.database().ref('users/'+uid));
        var asscns = $firebaseArray(firebase.database().ref('users/'+uid+'/associations/'));

        var associations = {
            get: function(id) {
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

        return {
            associations: associations
        }
    }
})();