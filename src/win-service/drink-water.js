//1、引入模块  使用的http服务协议是RFC2616  nodejs的作者已经写好了，直接引入就行
let schedule = require('node-schedule');
let task = require('../tasks/drink-water');
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
    let today = await task.main();
    let str = `## 下次安排 \r\n\r\n\r\n\r\n`;

    today.forEach(p => {
        str += `**${p.name}** : ${p.record.customer.map(r => r.name).join('、')}\r\n\r\n`;
    })

    markdown.markdown = {
        title: `下次倒水安排~`,
        text: str
    }
    markdown.at.isAtAll = true;
    send(markdown)
}
// job();


function scheduleCronstyle() {
    //周一到周五下午自动抽水
    schedule.scheduleJob('10 35 5 * * 1-5', function () {
        console.log('scheduleCronstyle:' + new Date());
        job();
    });
}

scheduleCronstyle();

