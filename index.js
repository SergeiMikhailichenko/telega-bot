const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();
const Monitor = require('ping-monitor');
var fs = require('fs');

const msgBotOnline = () => {
    fetch('https://api.telegram.org/bot' + process.env.BOT_TOKEN + '/sendMessage?chat_id=-804704016&parse_mode=HTML&text=' + 'Бот работает');
};
setInterval(function() {msgBotOnline()}, 900000);
const myFunctions = require('./functions');
const myConstants = require('./constants');
const { title } = require('process');



const bot = new Telegraf(process.env.BOT_TOKEN);

//////////// Monitor 
const myObject = {};
for (i = 0; i < myConstants.urlAdres.length; i += 1) {
    myObject[i] = new Monitor({website: myConstants.urlAdres[i][0], title: myConstants.urlAdres[i][1],interval: 1});
}

for (const item in myObject) {
    myObject[item].on('up', function (res, state) {
        console.log(`${myObject[item]['website']} is online`);
        fs.appendFile('log', `${myFunctions.nowDate()} online! ${res.website}\n`, function (err) {
            if (err) throw err;
        });
    });
    myObject[item].on('down', function (res) {
        console.log(`${myObject[item]['website']} down`);
        fs.appendFile('log', `${myFunctions.nowDate()} is-down ${res.website}\n`, function (err) {
            if (err) throw err;
        });
    });
    myObject[item].on('stop', function (website) {
        console.log('stop');
        fs.appendFile('log', `${myFunctions.nowDate()} stopped ${website}\n`, function (err) {
            if (err) throw err;
        });
    });
    myObject[item].on('error', function (error) {
        console.log(error);
        fs.appendFile('log', `${myFunctions.nowDate()} error!! ${website} ${error}\n`, function (err) {
            if (err) throw err;
        });
    });
}
/////////////// END Monitor

bot.start((ctx) => myFunctions.startMessage(ctx));
bot.help((ctx) => ctx.reply(myConstants.commands));

bot.launch();

// // Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
