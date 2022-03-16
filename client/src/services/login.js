import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react';
import styles from '../css/login.module.css';
import { PropTypes } from 'prop-types';
import { useNavigate } from 'react-router';


async function loginUser(credentials) {
    return fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: credentials
    })
        .then(data => data.json())
        .then(data => {
            return data; 
        })
    /*.catch((error) => {
        console.warn("error occured: " + error); 
        return ''; 
    }); */
}

async function registerUser(credentials) {
    return fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: credentials
    })
        .then(data => data.json())
        .then(data => {
            return data;
        })
    /*.catch((error) => {
        console.warn('error occured: ' + error); 
        return ''; 
    })*/
}


export default function Login ({ setToken }){

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [Lstate, setLState] = useState('login');
    const [cpassword, setCpassword] = useState();
    const [invalidity, setInvalidity] = useState(false);

    const navigate = useNavigate(); 

    const handleSubmit = async e => {
        e.preventDefault();
        if (Lstate === 'register') {
            if (cpassword === password) {
                const token = await registerUser(JSON.stringify({ 'username': username, 'password': password })); 
                if (token === '') {
                    setInvalidity(true);
                } else if(token.error !== undefined && token.error === "dub_err"){
                    setInvalidity(true); 
                }else{
                    setToken(token);
                    navigate('/dashboard', {replace: true}); 
                    //window.location.href = "/dashboard"; 
                }
            } else {
                //the two passwords are not connected 
                setInvalidity(true);
            }
        } else {
            const token = await loginUser(JSON.stringify({ 'username': username, 'password': password }));
            if (token === '') {
                setInvalidity(true);
            } else {
                setToken(token);
                navigate('/dashboard', {replace: true}); 
                //window.location.href="/dashboard"; 
            }
        }
    }


    return (<div className={styles.fillout}>
        <div className={"row " + styles.background}>
            <div className='col-4'></div>
            <div className='col-4 loginComp'>
                <h1 className={styles.header}>Login</h1>
                <form className={styles.form} onSubmit={handleSubmit} action={Lstate === 'login' ? '/login' : '/register'}>
                    <label className={styles.label}>
                        <p className={styles.loginlabel}><b>User:</b></p>
                        <input type="email" onChange={e => setUsername(e.target.value)} required></input>
                    </label>


                    <label className={styles.label}>
                        <p><b>Password:</b></p>
                        <input type="password" onChange={e => setPassword(e.target.value)} required></input>
                    </label>

                    {Lstate !== 'login' ?
                        <label className={styles.label}>
                            <p><b>Confirm Password:</b></p>
                            <input type="password" onChange={e => setCpassword(e.target.value)} required></input>
                        </label> : null}

                    {invalidity === true ? <span className={styles.errorSpan}>
                        <p>Your username or password was wrong!</p>
                    </span> : null}

                    <button className={styles.submitButton}> Submit </button>
                </form>
                <button className={styles.registerLink} onClick={() => setLState(Lstate === 'register' ? 'login' : 'register')}> Click here to {Lstate !== 'register' ? 'Register' : 'Login'}</button>
            </div>
            <div className='col-4'></div>
        </div>
    </div>);
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}