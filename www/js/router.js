routeModule = angular.module('RouteModule',[]);
routeModule.config(function($routeProvider,$locationProvider) {
    $routeProvider
        .when('/',{templateUrl:'views/home.php',controller:HomeController})
        .when('/about',{templateUrl:'views/about.php',controller:AboutController})
        .when('/printer/:slug',{templateUrl:'views/printer.php',controller:PrinterController})
        .otherwise({redirectTo: '/'});
    // $locationProvider.html5Mode(true);
});
routeModule.factory('WS', ['$q', '$rootScope', function($q, $rootScope) {
    // We return this object to anything injecting our service
    var Service = {};
    // Keep all pending requests here until they get responses
    var callbacks = {};
    // Create a unique callback ID to map requests to responses
    var currentCallbackId = 0;
    // Create our websocket object with the address to the websocket
    var ws = new WebSocket("ws://"+window.location.host+"/socket/");
    var connected = false;
    var deflist = [];
    var printerSlug='';
    ws.onopen = function(){
        connected = true;
        $.each(deflist,function(idx,val) {
           val.resolve(ws);
        });
        $rootScope.$apply();
    };

    ws.onmessage = function(message) {
        listener(JSON.parse(message.data));
    };

    function sendRequest(request) {
        var defer = $q.defer();
        var callbackId = getCallbackId();
        callbacks[callbackId] = {
            time: new Date(),
            cb:defer
        };
        request.callback_id = callbackId;
        if(!connected) {
            d = $q.defer();
            deflist.push(d);
            d.promise.then(function(){
                ws.send(JSON.stringify(request));
            },function() {console.log("failed");});
        } else
            ws.send(JSON.stringify(request));
        return defer.promise;
    }

    function listener(data) {
        var messageObj = data;
        // If an object exists with callback_id in our callbacks object, resolve it
        if(callbacks.hasOwnProperty(messageObj.callback_id)) {
            $rootScope.$apply(callbacks[messageObj.callback_id].cb.resolve(messageObj.data));
            delete callbacks[messageObj.callbackID];
        }
    }
    // This creates a new callback ID for a request
    function getCallbackId() {
        currentCallbackId += 1;
        if(currentCallbackId > 10000) {
            currentCallbackId = 0;
        }
        return currentCallbackId;
    }
    Service.send = function(command,data) {
        return sendRequest({action:command,data:data,printer:printerSlug});
    }
    Service.selectPrinter = function(slug) {
        printerSlug = slug;
    }
    return Service;
}])
var app = angular.module('server', ['ngSanitize','RouteModule','Gauge','FoundationHelper','Filter','Widgets']);
function init() {
    app.run(function($location,$rootScope) {
        $rootScope.$on('$viewContentLoaded', function () {
            console.log('init foundation');
            $(document).foundation();
        });
        $location.path('/')});
    $(document).foundation();
}

function equalheight() {
    $('.equalheight').each(function(index) {
        var maxHeight = 0;
        $(this).children().each(function(index) {
            if($(this).height() > maxHeight)
                maxHeight = $(this).height();
        });
        $(this).children().height(maxHeight);
    });
}
$(window).bind("load",init);
$(window).bind("load", equalheight);
$(window).bind("resize", equalheight);