import React, { Component, useState } from 'react';
import CncFrame from './scripts/components/cncFrame';
import PageHeader from './scripts/components/pageHeader.js';
import './css/style.css';
import loginStyles from './css/login.module.css';
import MyNavbar from './scripts/components/Navbar';
import Login from './scripts/login';
import { Route, Routes } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from './scripts/components/dashboard';
import useToken from './scripts/useToken';
import authentification from './scripts/auth';
import PrivateRoute from './scripts/components/privateRoute';

function App() {

  const { token, setToken } = useToken();

  const ApplicationComponents = (<div>
    <PageHeader />
    <CncFrame />
  </div>);

  authentification()

  const dashboard = (<Dashboard></Dashboard>);

  const loginComponents = (value) => {
    return (<Login setToken={value}></Login>);
  }

  return (
    <div className={loginStyles.fillout}>
      <MyNavbar />
      <Router>
        <Routes>
          <Route exact path="/" element=
            {ApplicationComponents}>
          </Route>

          <Route path='/login'
            element={loginComponents(setToken)}>
          </Route>
          <Route path="/dashboard" element={<PrivateRoute/>}>
              <Route path="/dashboard" element={dashboard}></Route>
          </Route>
          <Route path='/dashboard' element={dashboard}></Route>
        </Routes>
      </Router>
    </div>);

}

export default App;
