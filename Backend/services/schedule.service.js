const cron = require('node-cron');
const {createBackup} = require('./backup.service');

cron.schedule('0 2 * * *', () => {
    createBackup();
    console.log("runing daily db backup");
});


