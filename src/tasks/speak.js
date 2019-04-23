//1、引入模块  使用的http服务协议是RFC2616  nodejs的作者已经写好了，直接引入就行
let schedule = require("node-schedule");

let { model, send, init } = require("../utils/to-ding");
let { text, markdown } = model;

let { tokens } = require("../utils/get-config");

// init(tokens.myTest);
init(tokens.token);

function sendText() {
    text.text = {
        content: `请输入昵称，两个字~`
    };
    // text.at.isAtAll = true;
    text.at.atMobiles = [];

    send(text);
}

function sendMarkdown() {
    markdown.markdown = {
        title: `下次倒水安排~`,
        text: `

        `
    };
    markdown.at.isAtAll = true;
    send(markdown);
}

sendText();
