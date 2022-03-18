const express = require('express'); 
const userController = require('../controllers/user.controller.js');
const autenciation = require("../middleware/authenciation.middleware.js"); 
const router = express.Router(); 

//GET
router.get('/dashboard', autenciation, userController.getUserFiles); 



//POST 
router.post('/save', autenciation, userController.saveProject); 


module.exports = router; 