export default function getAPICall(url, body){
    fetch(url, {
        method: "POST", 
        headers: {
            'Content-Type' : 'application/json'
        }, 
        body: body
    }).then((data) => data.json())
    .then((data) => data); 
}