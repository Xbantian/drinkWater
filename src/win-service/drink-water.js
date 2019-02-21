//1、引入模块  使用的http服务协议是RFC2616  nodejs的作者已经写好了，直接引入就行
let schedule = require("node-schedule");
let task = require("../tasks/drink-water");
// let { getDingToken } = require('../utils/get-config');
let { model, send, init } = require("../utils/to-ding");
let { markdown } = model;

let { tokens } = require("../utils/get-config");

init(tokens.token);

async function job() {
    try {
        let { today, newPersons } = await task.main();
        if (!today.length) {
            console.log("task 失败");
            return;
        }
        let str = `## 下次安排 \r\n\r\n\r\n\r\n`;

        today.forEach(p => {
            str += `**${p.name}** : ${p.record.customer
                .map(r => r.name)
                .join("、")}\r\n\r\n`;
        });

        markdown.markdown = {
            title: `下次倒水安排~`,
            text: str
        };
        markdown.at.isAtAll = true;
        send(markdown);
        setTimeout(() => {
            subJob(newPersons);
        }, 1000);
    } catch (e) {
        console.log(e);
    }
}

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

// try {
//     job();
// } catch (err) {
//     console.log(err);
// }

function scheduleCronstyle() {
    //周一到周五下午自动抽水
    schedule.scheduleJob("0 21 18 * * 1-5", function() {
        console.log("启动任务-scheduleCronstyle:" + new Date());
        try {
            job();
        } catch (err) {
            console.log(err);
        }
    });
}

scheduleCronstyle();
