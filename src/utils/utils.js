let http = require("http");

const toStr = todayObj => {
    let str = `## 下次安排 — ${todayObj.key} \r\n\r\n\r\n\r\n`;

    todayObj.today.forEach(p => {
        str += `**${p.name}** : ${p.record.customer
            .map(r => r.name)
            .join("、")}\r\n\r\n`;
    });
    return str;
};

const isHoliday = (today = new Date()) => {
    let date = `${today.getFullYear()}-${today.getMonth() +
        1}-${today.getDate()}`;
    return new Promise((res, rej) => {
        let req = http.request(
            {
                hostname: "timor.tech",
                path: "/api/holiday/info/" + date,
                method: "GET"
            },
            function(response) {
                var str = "";
                response.on("data", function(chunk) {
                    str += chunk;
                });
                response.on("end", function() {
                    res(JSON.parse(str));
                });
            }
        );
        req.on("error", e => {
            console.error(`请求假期遇到问题: ${e}`);
            rej(e);
        });
        req.end();
    });
};

const doJobWhenWeekend = job => {
    let date = new Date();
    let isWeekend = date.getDay == 0 || date.getDay == 6;
    isHoliday(date)
        .then(res => {
            //周末，但是要上班（补班）|班
            if (isWeekend && res.holiday && !res.holiday.holiday) {
                job();
            }
            //周末，是节假日 |假
            if (isWeekend && res.holiday && res.holiday.holiday) {
            }
            //周末，不是节假日 |正常周末
            if (isWeekend && !res.holiday) {
            }

            //不是周末，不是节假日    这种情况应该不会有
            if (!isWeekend && res.holiday && !res.holiday.holiday) {
            }
            //不是周末，是节假日 |工作日放假
            if (!isWeekend && res.holiday && res.holiday.holiday) {
            }
            //不是周末，不是节假日 | 班
            if (!isWeekend && !res.holiday) {
                job();
            }
        })
        .catch(e => {
            console.log(e);
        });
};

module.exports = {
    toStr,
    isHoliday,
    doJobWhenWeekend
};
