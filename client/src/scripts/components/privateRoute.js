import { useEffect, useState } from "react";
import { Route } from "react-router";
import { Navigate, Outlet } from "react-router-dom";


const PrivateRoute = ({ ...rest }) => {

    const [auth, setAuth] = useState(false);
    const [isTokenValidated, setIsTokenValidated] = useState(false);

    useEffect(() => {
        // send jwt to API to see if it's valid
        let token = localStorage.getItem("token");
        if (token) {
            fetch('http://localhost:5000/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: token
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