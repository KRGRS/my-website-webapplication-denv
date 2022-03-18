const cryptoFunc = require("../utils/cryptoFunctions.js"); 
const connection = require("../utils/database.js"); 
const fs = require("fs");

function register(req, res) {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    let passValues = cryptoFunc.hashPassword(password);
    let calculatedToken = cryptoFunc.generateAccessToken({ username: username });

    connection.query('INSERT INTO users (email, password, salt, iterations, username) VALUES (?, ?, ?, ?, ?)', [email, passValues.hash, passValues.salt, passValues.iterations, username], function (err, result) {
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

        try {
            if (fs.existsSync(path.join(__dirname, "user_files", username))) {
                fs.mkdirSync(path.join(__dirname, "user_files", username));
            }
        } catch (err) {
            console.error(err);
        }

        res.send({
            token: calculatedToken
        })
    })
}

function login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    connection.query('SELECT password, salt, iterations, username FROM users WHERE email=(?)', [email], function (err, result) {
        if (err) {
            res.sendStatus(500); 
        };

        if (cryptoFunc.isPasswordCorrect(result[0].password, result[0].salt, +result[0].iterations, password)) {

            let generatedToken = cryptoFunc.generateAccessToken({email: email});

            connection.query('INSERT INTO activeTokens (token) VALUES (?)', [generatedToken], function (err, result) {
                if (err) { 
                    res.sendStatus(500);
                }
            })

            res.send({
                token: generatedToken,
                username: result[0].username, 
            })
        }
    })
}

module.exports = {
    login, register, 
}