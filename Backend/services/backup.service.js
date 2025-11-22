const { exec } = require("child_process");  // aknna bnktb gwa el cmd 
const path = require("path")
const fs = require('fs');

// folder -> backup gwah folder backup w date w gwa kol file hyba feh kol file ll collection


const createBackup = () => {
    const timpstamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFolder = path.join(__dirname,'..','backup',`backup-${timpstamp}`);
    if (!fs.existsSync(backupFolder)) {
        fs.mkdirSync(backupFolder, { recursive: true });
    }
    const mongoURI = process.env.MONGO_URI;
    const command = `mongodump --uri=${mongoURI} --out=${backupFolder} --gzip`;
    exec(command, (err,stdout,stderr) => {
        if(err){
            console.log(`[backup Err]: ${err.message}`);
        }else{
            console.log(`back up completed${stdout}`)
        }
    })
}

module.exports = {createBackup};
