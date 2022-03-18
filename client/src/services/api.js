
/**
 * 
 * @param {String} url 
 * @param {String} param would be the username as JSON object 
 * @param {String} token 
 */
function getAPICall(url, param, token) {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
            'params': JSON.stringify({ username: param }),
        },
    }).then((data) => {

        if(data.ok){
            return data.json(); 
        }else{
            return null; 
        }
    })
        .then((data) => {
            console.log(data); 
            return data;  
        });
}

function postAPIProjectsCall(url, body) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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

function postAPICall(url, body) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    }).then((data) => {
        if (data.status === 201) {
            return true;
        } else {
            return false;
        }
    }).catch((err) => {
        throw err;
    })
}



export { getAPICall, postAPICall, postAPIProjectsCall }; 