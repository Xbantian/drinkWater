const toStr = today => {
    let str = `## 下次安排 \r\n\r\n\r\n\r\n`;

    today.forEach(p => {
        str += `**${p.name}** : ${p.record.customer
            .map(r => r.name)
            .join("、")}\r\n\r\n`;
    });
    return str;
};

module.exports = {
    toStr
};
