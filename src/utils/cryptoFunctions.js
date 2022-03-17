const crypto = require("crypto"); 
const jwt = require('jsonwebtoken'); 
const pbkdf2 = require('pbkdf2'); 
require('dotenv').config("../config/.env"); 


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

export {generateAccessToken, hashPassword, isPasswordCorrect}; 