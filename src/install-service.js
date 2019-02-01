var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name: 'happy-new-year',
    description: '喝水群新年彩蛋',
    script: require('path').join(__dirname, './win-service/happy-new-year.js')
});

// Listen for the "install" event, which indicates the
// process is available as a service.
// svc.on('install', function () {
//     svc.start();
// });

svc.install();
// svc.uninstall();