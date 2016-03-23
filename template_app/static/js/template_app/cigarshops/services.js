angular.module('template_app').factory('getClientShop', [function() {
    "use strict";
    var getClientShopInstance = function(serverShop) {
        var retval = {'name': serverShop.name,
                      'location': {'lat': serverShop.location.coordinates[1],
                                   'long': serverShop.location.coordinates[0]},
                      'id': serverShop.id,
                      'resource_uri': serverShop.resource_uri,
                      'owner': serverShop.owner,
                      'beingEdited': false,
                      'editable': true};
        return retval;
    };
    return getClientShopInstance;
}]);


angular.module('template_app').factory('getServerShop', [function() {
    "use strict";
    var getServerShopInstance = function(clientShop) {
        var retval = {'name': clientShop.name,
                      'location': {"coordinates": [parseFloat(clientShop.location.long),
                                                   parseFloat(clientShop.location.lat)],
                                   "type": "Point"},
                      'id': clientShop.id,
                      'resource_uri': clientShop.resource_uri,
                      'owner': clientShop.owner};
        return retval;
    };
    return getServerShopInstance;
}]);