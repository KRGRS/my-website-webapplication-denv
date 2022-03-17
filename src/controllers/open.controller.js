import { hashPassword, generateAccessToken, isPasswordCorrect } from "../utils/cryptoFunctions";
import { connection } from "../utils/database.js";
const fs = require("fs");

function register(req, res) {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    let passValues = hashPassword(password);
    let calculatedToken = generateAccessToken({ username: username });

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

    connection.query('SELECT password, salt, iterations FROM users WHERE username=(?)', [email], function (err, result) {
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
}

module.exports = {
    login, register, 
}