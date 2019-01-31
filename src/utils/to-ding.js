let https = require('https');

const model = {
    text: {
        msgtype: `text`,
        text: { content: 'text内容' },
        at: {
            atMobiles: [],//电话号码数组
            isAtAll: false
        }
    },
    link: {
        msgtype: `link`,
        link: {
            text: '',
            title: '',
            picUrl: '',
            messageUrl: ''
        },
        at: {
            atMobiles: [],//电话号码数组
            isAtAll: false
        }
    },
    markdown: {
        msgtype: `markdown`,
        markdown: {
            title: `markdown标题`,
            text: `markdown内容`
        },
        at: {
            atMobiles: [],//电话号码数组
            isAtAll: false
        }
    },
    actionCard: {},
    feedCard: {},
}
let send = (model) => {

    const requestData = JSON.stringify(model);

    const req = https.request({
        hostname: 'oapi.dingtalk.com',
        port: 443,
        path: '/robot/send?access_token=' + token,
        method: "POST",
        json: true,
        headers: {
            'Content-Type': "application/json; charset=utf-8"
        }
    });
    req.write(requestData);
    req.on('error', function (err) {
        console.error(err);
    });
    req.end();
}
let token = '';

let init = (x) => token = x;


module.exports = {
    model,
    send,
    init
}
//钉钉配置连接
//https://open-doc.dingtalk.com/microapp/serverapi2/qf2nxq

// export { model }