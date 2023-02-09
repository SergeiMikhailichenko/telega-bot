// const myConstants = require('./constants');

const startMessage = (ctx) => {
    console.log(ctx.message);
    ctx.reply(`
    Привет, ${ctx.message.from.first_name}!\nДля начала работы введи /help
    `);
};
module.exports.startMessage = startMessage;

const nowDate = () => {
    var nowTime = new Date();
    return nowTime.toUTCString(); 
};
module.exports.nowDate = nowDate;

