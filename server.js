const express = require("express"); 
const app = express(); 
const port = 5000; 

var favicon = require('serve-favicon'); 
var path = require('path'); 

app.use(favicon(path.join(__dirname, 'client', 'public', 'favicon.ico'))); 

app.get("/", (req, res) => {
    
}); 

app.listen(port, () => {
    console.log(`Listens on port: ${port}`); 
}); 



