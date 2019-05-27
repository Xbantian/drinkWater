//公平模式，服务的人越多减的越多
const VALUE = 15; //收服务者加15点
let mysql = require("mysql");
let { toStr } = require("../utils/utils");
let special = null;
try {
    special = require("../utils/specialWater").special;
} catch (err) {
    console.log(err);
}

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    // database: "water_test"
    database: "water"
});
connection.connect();

let insertRecord = "INSERT INTO record(sid,mid,createTime,scale) VALUES ?";
let insertRecordStr = "INSERT INTO record_str(record,createTime) VALUES ?";
let updatePlayer = "UPDATE player SET scale = ?,count = ? WHERE Id = ?";

async function myWait(fun) {
    return new Promise((res, rej) => {
        fun(res);
    });
}

async function main() {
    let persons = await myWait(res => {
        connection.query("SELECT * FROM player where isHoliday=0;", function(
            error,
            results,
            fields
        ) {
            if (error) {
                console.log(error);
                return;
            }
            res(results);
        });
    });
    //每日备份数据
    console.log("----------------------今日数据--------------------------");
    console.log(persons);
    console.log("----------------------今日数据--------------------------");
    persons.forEach(p => {
        p.randomNum = services.getRandomNum(1000000);
    });
    persons.sort((a, b) => a.randomNum - b.randomNum);
    //分组处理
    let personGroup = services.groupBy(persons);

    let todayList = [];
    for (var key in personGroup) {
        let { today, waiterNum } = services.start(personGroup[key]);
        todayList.push({
            today,
            key
        });
    }

    //更新每个人的数据大数据库，这里应该写成批量更新
    for (let idx = 0; idx < persons.length; idx++) {
        const p = persons[idx];
        // let t = today.find(t => t.name == p.name);
        let t = todayList.find(todayObj =>
            todayObj.today.find(t => t.name == p.name)
        );
        if (t) {
            t = t.today;
            p.scale -= VALUE + t.record.customer.length * VALUE;
            p.count++;
        }
        p.scale += VALUE;
        await myWait(res => {
            connection.query(updatePlayer, [p.scale, p.count++, p.id], function(
                err,
                result
            ) {
                if (err) {
                    console.log(err);
                    return;
                }
                res();
            });
        });
    }

    //更新记录到数据库
    let t = [];
    // today.forEach(s => {
    //     s.record.customer.forEach(m => {
    //         t.push([s.id, m.id, s.record.date, VALUE]);
    //     });
    // });
    todayList.forEach(todayObj => {
        todayObj.today.forEach(s => {
            s.record.customer.forEach(m => {
                t.push([s.id, m.id, s.record.date, VALUE]);
            });
        });
    });
    await myWait(res => {
        connection.query(insertRecord, [t], function(err, result) {
            if (err) {
                console.log(err);
                return;
            }
            res();
        });
    });

    //再取一次更新的数据
    let newPersons = await myWait(res => {
        connection.query(
            "SELECT * FROM player where isHoliday=0 order by scale;",
            function(error, results, fields) {
                if (error) {
                    console.log(error);
                    return;
                }
                res(results);
            }
        );
    });

    //保存明日安排
    for (let idx = 0; idx < todayList.length; idx++) {
        const todayObj = todayList[idx];
        await myWait(res => {
            connection.query(
                insertRecordStr,
                [[[toStr(todayObj.today), new Date()]]],
                function(err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    res();
                }
            );
        });
    }

    //记录本次结果
    console.log(JSON.stringify(todayList));
    // connection.end();
    return { todayList, newPersons };
}

async function morning(params) {
    // connection.connect();
    let today = await myWait(res => {
        connection.query(
            "SELECT * FROM record_str order by id desc limit 1;",
            function(error, results, fields) {
                if (error) {
                    console.log(error);
                    return;
                }
                res(results);
            }
        );
    });
    // connection.end();
    return today;
}

//功能函数
const services = {
    //返回1-num;
    getRandomNum: num => {
        return Math.ceil(Math.random() * num);
    },
    start: persons => {
        let today = [];
        let tempPersons = JSON.parse(JSON.stringify(persons));
        //算出需要多少个服务员
        let waiterNum = Math.ceil(tempPersons.length / 4);
        //计算选中人会减掉的份额
        // let decCount = (persons.length - waiterNum) * RATE;
        let decCount = 3 * VALUE;

        while (today.length < waiterNum) {
            let total = services.getTotal(tempPersons);
            let num = services.getRandomNum(total);
            let begin = 0;
            tempPersons.find((p, idx) => {
                if (services.isCurrent(begin, p.scale, num)) {
                    // p.count++;
                    //为了不出现负数
                    if (p.scale - decCount > 0) {
                        tempPersons.splice(idx, 1);
                        today.push(p);
                    }
                    return true;
                }
                begin += p.scale;
            });
        }
        today.forEach(p => {
            p.record = {
                date: new Date(),
                customer: []
            };
        });
        // tempPersons.forEach(p => {
        //     p.randomNum = services.getRandomNum(1000000);
        // });
        // tempPersons.sort((a, b) => a.randomNum - b.randomNum);

        special && special(today, tempPersons); //进一步特殊乱序
        tempPersons.forEach((p, idx) => {
            let current = today[idx % waiterNum];
            current.record.customer.push(p);
        });
        return { today, waiterNum };
    },
    getTotal: persons => {
        let total = 0;
        persons.forEach(p => {
            total += p.scale;
        });
        return total;
    },
    isCurrent: (begin, len, current) => current <= begin + len,
    groupBy: list => {
        let obj = {};
        list.forEach(item => {
            obj[item.group] = obj[item.group] || [];
            obj[item.group].push(item);
        });
        return obj;
    }
};
module.exports = {
    main,
    morning
};

// main().then(re => {
//     console.log(re);
// });
// console.log(main());
