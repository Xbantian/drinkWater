var Service = require("node-windows").Service;

// Create a new service object
var svc = new Service({
    name: "drinkWater",
    description: "喝水群机器人",
    script: require("path").join(__dirname, "./win-service/drink-water.js")
});

// Listen for the "install" event, which indicates the
// process is available as a service.
// svc.on('install', function () {
//     svc.start();
// });

svc.install();
// svc.uninstall();
