import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";


const PrivateRoute = ({ ...rest }) => {

    const [auth, setAuth] = useState(false);
    const [isTokenValidated, setIsTokenValidated] = useState(false);

    useEffect(() => {
        // send jwt to API to see if it's valid
        let token = localStorage.getItem("token");
        let username = localStorage.getItem("username"); 

        if (token) {
            fetch('http://localhost:5000/' + username + '/auth', {
                method: 'GET',
                params: JSON.stringify(username), 
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization' : token
                },
                })
                .then((res) => {
                    return res.json()
                })
                .then((json) => {
                    if (json.auth) {
                        setAuth(true);
                    }
                })
                .catch((err) => {
                    setAuth(false);
                    localStorage.removeItem("token");
                })
                .then(() => setIsTokenValidated(true));
        } else {
            setIsTokenValidated(true); // in case there is no token
        }

    }, [])

    if (!isTokenValidated) return <div />; // or some kind of loading animation

    return (auth ? <Outlet {...rest} /> : <Navigate to="/login" />);
}

export default PrivateRoute; 