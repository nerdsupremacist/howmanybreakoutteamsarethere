app.controller('HowManyCtrl', function($scope, $routeParams, $http) {

    $scope.events = [];

    function loadCurrentEvents(callback) {
        $http.get("https://backend.break-out.org/event/").then(function(res) {
            callback(res.data.filter((x) => x.isCurrent));
        }, function(err) {
            console.error(err);
            callback(null);
        });
    }

    function loadTeamsForEvent(event, callback) {
        $http.get("https://backend.break-out.org/event/" + event.id + "/team/").then(function(res) {
            callback(res.data);
        }, function(err) {
            console.error(err);
            callback(null);
        });
    }

    function loadTeamsForEventAndAddToScope(event) {
        loadTeamsForEvent(event, (x) => scope.events.push({ "event": event, "count": x.length }));
    }

    loadCurrentEvents(function(events) {
        if (events !== null) {
            for (var i = 0; i < events.length; i++) {
                loadTeamsForEventAndAddToScope(events[i]);
            }
        }
    })

});