app.controller('HowManyCtrl', function($scope, $routeParams, $http) {

    var canBeNotified = false;

    function requestPermission() {
        console.log("Checking Notification Status");
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            canBeNotified = true;
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission(function(permission) {
                if (permission === "granted") {
                    canBeNotified = true;
                    var notification = new Notification("Great! I'll notify you when new teams are there!");
                }
            });
        }
    }

    $scope.openForRegistration = true;
    $scope.events = {};
    $scope.total = 0;

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
        var title = event.title;
        var city = event.city;
        var previous = $scope[title] || 0;
        loadTeamsForEvent(event, (x) => {
            $scope.events[title] = x.length
            $scope.total = $scope.total + x.length - previous;
            if (previous != 0 && x.length > previous && canBeNotified) {
                var newTeams = x.length - previous;
                var notification = new Notification(newTeams + " new Team(s) in " + city);
            }
        });
    }

    requestPermission();

    function doit() {
        loadCurrentEvents(function(events) {
            if (events === null) return;

            for (var i = 0; i < events.length; i++) {
                loadTeamsForEventAndAddToScope(events[i]);
            }

            $scope.openForRegistration = events.reduce((a, x) => a || x.openForRegistration, false);
            if (!$scope.openForRegistration) return;

            setTimeout(function() {
                doit();
            }, 10000);
        });
    }

    doit();

});
