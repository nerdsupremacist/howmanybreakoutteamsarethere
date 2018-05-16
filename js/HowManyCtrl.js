app.controller('HowManyCtrl', function($scope, $routeParams, $http) {

    $scope.events = {};

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
        var title = event.title
        var previous = $scope[title]
        loadTeamsForEvent(event, (x) => {
            $scope.events[title] = x.length
            if (x.length > previous) {
                // Push notification
            }
        });
    }

    loadCurrentEvents(function(events) {
        if (events !== null) {
            function doit() {
                for (var i = 0; i < events.length; i++) {
                    loadTeamsForEventAndAddToScope(events[i]);
                }
                setTimeout(function () {
                    doit();
                }, 1000);
            }

            doit();
        }
    })

});
