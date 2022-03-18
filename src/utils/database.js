const mysql = require("mysql"); 
const dotenv = require("dotenv"); 
const path = require("path"); 

dotenv.config({ path: path.normalize(path.join(__dirname,  "..", "config", ".env")), override: false });


//connect to DB 
const connection = mysql.createConnection({
    host: process.env.DB_HOST.toString(),
    user: process.env.DB_USER.toString(),
    password: '1234',
    database: process.env.DB.toString(),
    insecureAuth: true
});

connection.connect(function (err) {
    if (err) {
        return console.error('error:' + err.message);
    }

    //console.log("successfully connected to database"); 
});

 module.exports = connection; 