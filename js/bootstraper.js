(function () {

    var config = {
        host: window.location.hostname,
        prefix: "/",
        port: window.location.port,
        isSecure: window.location.protocol === "https:"
    };

    require.config( {
        baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port: "") + config.prefix + "resources"
    } );
    


    var app = angular.module('awesomeQlikApp', ['ngRoute']);

    // configure application routes
    app.config(["$routeProvider", function ($routeProvider) {
        $routeProvider
            .when('/', { templateUrl: 'partials/home.html', controller: 'HomeCtrl' })
            .otherwise({ templateUrl: 'partials/other.html', controller: 'OtherCtrl' });
    }]);

    // configure home controller
    app.controller("HomeCtrl" , ["$scope", "QlikHelper", function($scope, QlikHelper) {
        console.info("in home controller");
        QlikHelper();
    }]);


    // configure other controller
    app.controller("OtherCtrl" , ["$scope", "QlikHelper", function($scope, QlikHelper) {
        console.info("in other controller");
        QlikHelper();
    }]);


    // configure a service that will instanciate Sense bar.QVF (replace with yours)
    // and then loop over all HTML DOM nodes that have the qsObject class and add Sense
    // visualizations
    app.service("QlikHelper", function () {
        return function () {    
            require( ["js/qlik"], function ( qlik ) {
                var senseApp;

                qlik.setOnError(function(error) {
                    $("#error span").html(error.message);
                    $("#error").show();
                    $("#closeerror").on("qv-activate", function() {
                        $("#error").hide();
                    });
                });

                senseApp = qlik.openApp("bar.qvf", config);

                if (document.getElementById('CurrentSelections') && document.getElementById('CurrentSelections').childNodes.length === 0) {
                    senseApp.getObject( 'CurrentSelections', 'CurrentSelections' );
                }
           
                $(".qsObject").each(function() {
                    senseApp.getObject(this, $(this).data("qsid"));
                });
            });
        }
    });


    angular.element(document).ready(function() {
        angular.bootstrap(document.getElementById("applicationWrapper"), ["awesomeQlikApp"], {
            strictDi: true
        });
    });

}());

