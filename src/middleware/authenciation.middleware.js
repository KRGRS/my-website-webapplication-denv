const jwt = require("jsonwebtoken"); 
const connection = require("../utils/database.js"); 

const authenciate = (req, res, next) => {

    const token = req.get("Authorization"); 

    connection.query('SELECT token FROM activeTokens WHERE token=(?)', [token], function (err, result) {
        if (err){
            res.sendStatus(511);
            return;  
        }
    })

    jwt.verify(token, process.env.TOKEN_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
        if (err) {
            res.sendStatus(511); 
            return; 
        }

        res.locals.email = decoded.email; 
        next(); 
    })
}


module.exports = authenciate; 