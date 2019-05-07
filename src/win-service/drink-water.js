//1、引入模块  使用的http服务协议是RFC2616  nodejs的作者已经写好了，直接引入就行
let schedule = require("node-schedule");
let task = require("../tasks/drink-water");
// let { getDingToken } = require('../utils/get-config');
let { model, send, init } = require("../utils/to-ding");
let { markdown } = model;
let { tokens } = require("../utils/get-config");
let { toStr, doJobWhenWeekend } = require("../utils/utils");
init(tokens.myTest);

//晚间主任务
async function job() {
    try {
        let { today, newPersons } = await task.main();
        if (!today.length) {
            console.log("task 失败");
            return;
        }

        subJob(newPersons);
        //一秒后发安排
        setTimeout(() => {
            markdown.markdown = {
                title: `下次倒水安排~`,
                text: toStr(today)
            };

            markdown.at.isAtAll = true;
            send(markdown);
        }, 1000);
    } catch (e) {
        console.log(e);
    }
}
//晚间子任务
function subJob(newPersons) {
    let str = `# 幸运榜 \r\n\r\n\r\n\r\n`;

    newPersons.forEach(p => {
        str += `**${p.name}** : ${p.scale}\r\n\r\n`;
    });

    markdown.markdown = {
        title: `下次倒水安排~`,
        text: str
    };
    markdown.at.isAtAll = false;
    send(markdown);
}
//早上播报
async function morningJob() {
    try {
        let today = await task.morning();
        console.log(today);
        markdown.markdown = {
            title: `今日倒水安排~`,
            text: today[0].record.replace("下次", "今日")
        };
        markdown.at.isAtAll = true;
        send(markdown);
    } catch (e) {
        console.log(e);
    }
}

function scheduleCronstyle() {
    //抽奖
    schedule.scheduleJob("0 21 18 * * ?", function() {
        console.log("启动任务-抽奖:" + new Date());
        doJobWhenWeekend(job);
    });
    //播报
    schedule.scheduleJob("0 10 10 * * ?", function() {
        console.log("启动任务-播报:" + new Date());
        doJobWhenWeekend(morningJob);
    });
}

scheduleCronstyle();

// try {
//     setTimeout(() => {
//         job();
//         setTimeout(() => {
//             morningJob();
//         }, 2000);
//     }, 6000);
// } catch (err) {
//     console.log(err);
// }
