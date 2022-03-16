const express = require("express");
const app = express();
const port = 5000;
const favicon = require('serve-favicon');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const crypto = require('crypto');
var pbkdf2 = require('pbkdf2'); 
var fs = require('fs'); 

//get config vars 
dotenv.config({ path: './.env', override: false });

//console.log(process.env.DB_HOST); 


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

//CORS middleware
var corsMiddleware = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //replace localhost with actual host
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');

    next();
}

//tell the server what middleware it should use
app.use(cors());
app.use(favicon(path.join(__dirname, 'client', 'public', 'favicon.ico')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(corsMiddleware);

//functions 
function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

function hashPassword(password) {
    var salt = crypto.randomBytes(128).toString('base64');
    var iterations = 10000;
    var hash = pbkdf2.pbkdf2Sync(password, salt, iterations, 32, 'sha512');

    return {
        salt: salt,
        hash: hash,
        iterations: iterations
    };
}

function isPasswordCorrect(savedHash, savedSalt, savedIterations, passwordAttempt) {

    return (savedHash.toString() == pbkdf2.pbkdf2Sync(passwordAttempt, savedSalt, savedIterations, 32, 'sha512').toString());
}

//routing 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'public', 'index.html'));
});

app.post("/auth", (req, res) => {

    connection.query('SELECT token FROM activeTokens WHERE token=(?)', [req.body.token], function (err, result) {
        if (err) throw err;
    })

    jwt.verify(req.body.token, process.env.TOKEN_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
        if (err) {
            res.send({ 'auth': false });
            return;
        }

        res.send({'auth' : true});
        return;
    })
})

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let passValues = hashPassword(password);
    let calculatedToken = generateAccessToken({ username: username });

    connection.query('INSERT INTO users (username, password, salt, iterations) VALUES (?, ?, ?, ?)', [username, passValues.hash, passValues.salt, passValues.iterations], function (err, result) {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") {
                res.send({ 'error': 'dub_err' });
                return;
            }
        } else {
            connection.query('INSERT INTO activeTokens (token) VALUES (?)', [calculatedToken], function (err, result) {
                if (err) throw err;
            })
        }

        try{
            if(fs.existsSync(path.join(__dirname, "user_files", username))){
                fs.mkdirSync(path.join(__dirname, "user_files", username)); 
            }
        }catch(err){
            console.error(err); 
        }

        res.send({
            token: calculatedToken
        })
    })
})

app.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    connection.query('SELECT password, salt, iterations FROM users WHERE username=(?)', [username], function (err, result) {
        if (err) {
            //console.log("------------\n" + err);
        };

        //console.log(isPasswordCorrect(result[0].password, result[0].salt, +result[0].iterations, password)); 

        if (isPasswordCorrect(result[0].password, result[0].salt, +result[0].iterations, password)) {

            let generatedToken = generateAccessToken({ username: username });

            connection.query('INSERT INTO activeTokens (token) VALUES (?)', [generatedToken], function (err, result) {
                if (err) throw err;
            })

            res.send({
                token: generatedToken
            })
        }
    })
})

app.post('/save', (req, res) => {
    connection.query('SELECT token FROM activeTokens WHERE token=(?)', [req.body.token], function (err, result) {
        if (err) throw err;
    })

    jwt.verify(JSON.parse(req.body.token).token, process.env.TOKEN_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
        if (err) {
        }

        fs.writeFile(path.join(__dirname, "user_files", decoded.username, req.body.title + ".txt"), req.body.data, {flag: "w+"}, err => {
            if(err !== null){
                throw err; 
            }   
        }); 

        res.sendStatus(201); 
    })
})

app.post('/getUserFiles', (req, res) => {

    connection.query('SELECT token FROM activeTokens WHERE token=(?)', [req.body.token], function (err, result) {
        if (err) throw err;
    })

    jwt.verify(JSON.parse(req.body.token).token, process.env.TOKEN_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
        if (err) {
        }

        fs.readdir(path.join(__dirname, "user_files", decoded.username), (err, files) => {
            if(err != null)throw err; 
            res.send({files: JSON.stringify(files)}); 
        })
    })
})

app.listen(port, () => {
    console.log(`Listens on port: ${port}`);
});



