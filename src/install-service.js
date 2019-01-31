var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name: 'adrinkWater',
    description: '自定义服务-喝水',
    script: require('path').join(__dirname, './win-service/drink-water.js')
});

// Listen for the "install" event, which indicates the
// process is available as a service.
// svc.on('install', function () {
//     svc.start();
// });

svc.install();
// svc.uninstall();