//1、引入模块  使用的http服务协议是RFC2616  nodejs的作者已经写好了，直接引入就行
let schedule = require('node-schedule');

let { model, send, init } = require('../utils/to-ding');
let { markdown } = model;

let token = null;
try {
    token = require('../../config/ding-token').myTest;
    console.log(token);
} catch (err) {
    console.log(err);
}

init(token);

async function job() {

}



job();



function scheduleCronstyle() {
    schedule.scheduleJob('0 0 0 1 2 * 2019', function () {
        console.log('scheduleCronstyle:' + new Date());
        job();
    });
}

scheduleCronstyle();

