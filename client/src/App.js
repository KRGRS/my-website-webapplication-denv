import React from 'react';
import PageHeader from './components/pageHeader.js';
import './css/style.css';
import loginStyles from './css/login.module.css';
import MyNavbar from './components/Navbar';
import Login from './services/login';
import { Route, Routes } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import useToken from './services/useToken';
import authentification from './services/auth';
import PrivateRoute from './components/privateRoute';
import { Dashboard, CncFrame } from './components';
import { useParams } from 'react-router';
import { Navigate } from 'react-router';

function App() {

  const { token, setToken } = useToken();
  let { user } = useParams();

  const ApplicationComponents = (<div>
    <PageHeader />
    <CncFrame />
  </div>);

  authentification();

  const dashboard = (<Dashboard></Dashboard>);

  const loginComponents = (value) => {
    return (<Login setToken={value}></Login>);
  }

  /* 
     <Route path="/a" element={<PrivateRoute />}>
            <Route exact path="/a" element=
              {ApplicationComponents}>
            </Route>
          </Route>
  */

  return (
    <div className={loginStyles.fillout}>
      <MyNavbar />
      <Router>
        <Routes>

          <Route path='/login'
            element={loginComponents(setToken)}>
          </Route>

          <Route path="/:user">
            <Route path="/:user/dashboard" element={dashboard}/>
          </Route>

          <Route path="/" element={<Navigate to="/login"/>}/>

        </Routes>
      </Router>
    </div>);

}

export default App;
