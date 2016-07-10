(function () {
    'use strict';

    angular
        .module('yt')
        .factory('ApiFactory', ApiFactory);

    ApiFactory.$inject = ['$http', '$localStorage'];

    function ApiFactory($http, $localStorage) {

        function getMyAssociations() {
            return $http.get('/api/associations/my/')
        }

        function createAssociation(data) {
            return $http.post('/api/associations/', data);
        }

        return {
            getMyAssociations: getMyAssociations,
            createAssociation: createAssociation
        }
    }
})();