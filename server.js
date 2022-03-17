const express = require("express");
const app = express();
const port = 5000;
const favicon = require('serve-favicon');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs'); 
const connection = require('./src/utils/database.js');  
const openRouter = require('./src/api-routes/open.routes'); 

//get config vars 
dotenv.config({ path: './config/.env', override: false });

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

//define Routers for Server 
app.use('/', openRouter); 
app.use('/:user', userRouter); 


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



