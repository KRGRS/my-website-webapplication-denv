import React, { Component, useState } from 'react';
import CncFrame from './scripts/cncFrame';
import PageHeader from './scripts/pageHeader.js';
import './css/style.css';
import loginStyles from './css/login.module.css';
import MyNavbar from './scripts/Navbar';
import Login from './scripts/login';
import { Route, Routes } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from './scripts/dashboard';
import useToken from './scripts/useToken';

function App() {

  const {token, setToken} = useToken(); 

  const ApplicationComponents = (<div>
    <PageHeader />
    <CncFrame />
  </div>);

  const loginComponents = (value) => {
    return (<Login setToken={value}></Login>); 
  }

  if(!token){
    return loginComponents(setToken); 
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
            element={loginComponents}>
          </Route>
        </Routes>
      </Router>
    </div>);

}

export default App;
