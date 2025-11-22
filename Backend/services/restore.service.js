const {exec} = require('child_process');
const path = require('path');
const { stdin, stdout, stderr } = require('process');

exports.restoreBackup = (folderName) => {
    // el __dirname elly ehna feh w .. n5rg meno w nro7 3la el backup w name bt3 el backup folder w name bt3 el db  
    // nro7 el folder bt3 el backup
    const backupPath = path.join(__dirname, '..', 'backup', folderName, 'myStore');
    const mongoURI = process.env.MONGO_URI;
    const command = `mongorestore --uri="${mongoURI}" --drop --gzip "${backupPath}"`;
    exec(command,( err, stdout, stderr)=> {
        if (err) {
            console.log('[Restore Error]', err.message);
            
        } else {
            console.log('[Restore Completed]',stdout);
        }
    });
} // el mafrod n3mel auto backup