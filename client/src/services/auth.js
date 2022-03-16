export default function authentification() {
  let token = localStorage.getItem('token'); 
  fetch('http://localhost:5000/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: token
  })
    .then(data => { 
       return data.json();  
    })
    .then((data) => {return data.auth })
    .catch(err => {
      console.error(err); 
    }); 
}