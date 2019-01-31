//公平模式，服务的人越多减的越多
const VALUE = 15;//收服务者加15点
let mysql = require('mysql');
let special = null;
try {
    special = require('../utils/specialWater').special;
} catch (err) {

}

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'water_test'
    // database: 'water'
});

let insertRecord = 'INSERT INTO record(sid,mid,createTime,scale) VALUES ?'
let updatePlayer = 'UPDATE player SET scale = ?,count = ? WHERE Id = ?';


async function myWait(fun) {
    return new Promise((res, rej) => {
        fun(res);
    })
}


async function main() {
    // await connection.connect();
    let persons = await myWait((res) => {
        connection.query('SELECT * FROM player;', function (error, results, fields) {
            if (error) throw error;
            // persons = results;
            console.log(results);
            res(results);
        });
    });
    //排除请假的人
    persons = persons.filter(p => !p.isHoliday)
    let { today, waiterNum } = services.start(persons);

    for (let idx = 0; idx < persons.length; idx++) {
        const p = persons[idx];
        let t = today.find(t => t.name == p.name);
        if (t) {
            p.scale -= (VALUE + t.record.customer.length * VALUE);
            p.count++;
        }
        p.scale += VALUE;
        await myWait((res) => {
            connection.query(updatePlayer, [p.scale, p.count++, p.id], function (err, result) {
                res();
            });
        })

    }
    // persons.forEach(p => {

    // });
    let t = [];
    today.forEach(s => {
        s.record.customer.forEach(m => {
            t.push([s.id, m.id, s.record.date, VALUE])
        })
    })
    await myWait((res) => {
        connection.query(insertRecord, [t], function (err, result) {
            if (err) {
                return;
            }
            res();
        });
    });
    connection.end();
    return today;
}

//功能函数
const services = {
    //返回1-num;
    getRandomNum: (num) => {
        return Math.ceil(Math.random() * num);
    },
    start: (persons) => {
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
            }
        })
        tempPersons.forEach(p => {
            p.randomNum = services.getRandomNum(1000000);
        })
        tempPersons.sort((a, b) => a - b);

        special && special(today, tempPersons);//进一步特殊乱序
        tempPersons.forEach((p, idx) => {
            let current = today[idx % waiterNum];
            current.record.customer.push(p);
        });
        return { today, waiterNum };
    },
    getTotal: (persons) => {
        let total = 0;
        persons.forEach(p => {
            total += p.scale;
        });
        return total;
    },
    isCurrent: (begin, len, current) => current <= begin + len,
}
module.exports = {
    main
}

// main();

// var str='';
// persons.forEach(p => {
//     str+="INSERT INTO `water`.`player` (`name`, `count`, `isHoliday`, `scale`) VALUES"+`('${p.name}', '${p.count}', '0', '${p.scale}');`;
// })
