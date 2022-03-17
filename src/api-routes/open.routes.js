const express = require("express"); 
const openController = require("../controllers/open.controller"); 
const router = express.Router(); 

router.post('/login', openController.login); 

router.post('/register', openController.register); 

module.exports = router; 