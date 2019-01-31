//1、引入模块  使用的http服务协议是RFC2616  nodejs的作者已经写好了，直接引入就行
let schedule = require('node-schedule');

let { model, send, init } = require('../utils/to-ding');
let { markdown } = model;

const token = `56fab40ea43f9b5b74c9b680879bf8f43db7ab8b24fe139c4281d61989f98044`;
init(token);

async function job() {

}



job();




function scheduleCronstyle() {
    // schedule.scheduleJob('10 49 11 * * 1-5', function () {
    //     console.log('scheduleCronstyle:' + new Date());
    // });
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
