//1、引入模块  使用的http服务协议是RFC2616  nodejs的作者已经写好了，直接引入就行
let schedule = require('node-schedule');

let { model, send, init } = require('../utils/to-ding');
let { text } = model;

let { tokens } = require('../utils/get-config');

init(tokens.myTest);

async function job() {
    text.text = {
        content: `大家好!
新年的钟声正在敲响
过去一年我们
喝水预防肾结石
喝水找到女朋友
喝水实现跨部门！
感谢大家一年的陪伴！

新的一年
祝福各位水友及家人
新年快乐，身体健康
万事如意，阖家欢乐！

Happy New Year! We are Family!

        ———来自爱你们的人工智障

`
    }
    text.at.isAtAll = true;
    send(text)
}


// job();


function scheduleCronstyle() {
    schedule.scheduleJob('58 59 23 31 1 * 2019', function () {
        console.log('scheduleCronstyle:' + new Date());
        job();
    });
    // schedule.scheduleJob('58 59 23 4 2 * 2019', function () {
    //     console.log('scheduleCronstyle:' + new Date());
    //     job();
    // });
}

// scheduleCronstyle();

