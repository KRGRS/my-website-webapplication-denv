const express = require('express'); 
const { helloWorld } = require('../controllers/user.controller');
const autenciation = require("../middleware/authenciation.middleware"); 
const router = express.Router(); 


router.post('/dashboard', autenciation, helloWorld); 


module.exports = router; 