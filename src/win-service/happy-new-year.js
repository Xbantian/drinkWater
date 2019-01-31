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
    schedule.scheduleJob('10 35 5 * * 1-5', function () {
        console.log('scheduleCronstyle:' + new Date());
        job();
    });
}

// scheduleCronstyle();

const speak = (content) => {
    ding.model.msgtype = 'text';
    ding.model.text.content = content
    ding.send(ding.model)
}
// speak(`那下周二就不抽了吧~`);
