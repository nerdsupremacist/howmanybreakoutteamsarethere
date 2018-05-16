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
            if (previous && x.length > previous && canBeNotified) {
                var newTeams = x.length - previous;
                var notification = new Notification(newTeams + " new Team(s) in " + title);
            }
        });
    }

    requestPermission();

    loadCurrentEvents(function(events) {
        if (events !== null) {
            function doit() {
                for (var i = 0; i < events.length; i++) {
                    loadTeamsForEventAndAddToScope(events[i]);
                }
                setTimeout(function() {
                    doit();
                }, 10000);
            }

            doit();
        }
    });

});
