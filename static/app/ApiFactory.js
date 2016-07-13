(function () {
    'use strict';

    angular
        .module('yt')
        .factory('ApiFactory', ApiFactory);

    ApiFactory.$inject = ['$http', '$localStorage'];

    function ApiFactory($http, $localStorage) {

        var associations = {
            get: function() {
                return $http.get('/api/associations/my/')
            },
            create: function(data) {
                return $http.post('/api/associations/', data);
            },
            delete: function(id) {
                return $http.delete('/api/associations/' + id)
            },
            edit: function(id, data) {
                return $http.patch('/api/associations/' + id + '/', data)
            }
        };

        return {
            associations: associations
        }
    }
})();