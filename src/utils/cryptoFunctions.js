const crypto = require("crypto"); 
const jwt = require('jsonwebtoken'); 
const { builtinModules } = require("module");
const pbkdf2 = require('pbkdf2'); 
const dotenv = require("dotenv"); 
const path = require("path"); 

dotenv.config({ path: path.normalize(path.join(__dirname,  "..", "config", ".env")), override: false });


//functions 
function generateAccessToken(email) {
    return jwt.sign(email, process.env.TOKEN_SECRET, { expiresIn: '1h' });
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

module.exports = {generateAccessToken, hashPassword, isPasswordCorrect}; 