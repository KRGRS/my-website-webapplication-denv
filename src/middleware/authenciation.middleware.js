const jwt = require("jsonwebtoken"); 
const connection = require("../utils/database.js"); 

const authenciate = (req, res, next) => {

    const token = req.header("Authorization"); 

    connection.query('SELECT token FROM activeTokens WHERE token=(?)', [token], function (err, result) {
        if (err) throw err;
    })

    jwt.verify(req.token, process.env.TOKEN_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
        if (err) {
            throw err; 
        }

        next(); 
    })
}


module.exports = authenciate; 