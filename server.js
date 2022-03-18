const express = require("express");
const app = express();
const port = 5000;
const favicon = require('serve-favicon');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const openRouter = require('./src/api-routes/open.routes'); 
const userRouter = require('./src/api-routes/user.routes.js'); 

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(corsMiddleware);

//define favicon for usage 
app.use(favicon(path.join(__dirname, 'client', 'public', 'favicon.ico')));

//define Routers for Server 
app.use('/', openRouter); 
app.use('/:user', userRouter); 


//routing 

app.listen(port, () => {
    console.log(`Listens on port: ${port}`);
});



