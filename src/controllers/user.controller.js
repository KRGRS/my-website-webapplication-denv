const fs = require("fs"); 
const path = require("path"); 

const pathToUserFiles = path.normalize(path.join(__dirname,  "..", "..", "user_files")); 

function getUserFiles(req, res){

    fs.readdir(path.join(pathToUserFiles, res.locals.email), (err, files) => {
        if(err != null)throw err; 
        res.send({files: JSON.stringify(files)}); 
    })
}

function saveProject(req, res){
    fs.writeFile(path.join(pathToUserFiles,  res.locals.email, req.body.title + ".txt"), req.body.data, {flag: "w+"}, err => {
        if(err !== null){
            throw err; 
        }   
    }); 

    res.sendStatus(201); 
}

module.exports =  {getUserFiles, saveProject}; 