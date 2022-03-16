

function getAPICall(url, body){
    fetch(url, {
        method: 'GET', 
        headers: {
            'Content-Type' : 'application/json'
        }, 
        body: body
    }).then((data) => data.json())
    .then((data) => data); 
}

function postAPIProjectsCall(url, body){
    return fetch(url, {
        method: 'POST', 
        headers: {
            'Content-Type' : 'application/json'
        }, 
        body: body
    }).then((data) => data.json())
    .then(data => { 
        return data.files; 
    })
    .catch((err) => {
        throw err; 
    })
}

function postAPICall(url, body){
    return fetch(url, {
        method: 'POST', 
        headers: {
            'Content-Type' : 'application/json'
        }, 
        body: body
    }).then((data) => {
        if(data.status === 201){
            return true;  
        }else{
            return false; 
        }
    }).catch((err) => {
        throw err; 
    })
}



export {getAPICall, postAPICall, postAPIProjectsCall}; 