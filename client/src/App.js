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
import { Dashboard , CncFrame} from './components';

function App() {

  const { token, setToken } = useToken();

  const ApplicationComponents = (<div>
    <PageHeader />
    <CncFrame />
  </div>);

  authentification(); 

  const dashboard = (<Dashboard></Dashboard>);

  const loginComponents = (value) => {
    return (<Login setToken={value}></Login>);
  }

  return (
    <div className={loginStyles.fillout}>
      <MyNavbar />
      <Router>
        <Routes>

          <Route path="/" element={<PrivateRoute />}>
            <Route exact path="/" element=
              {ApplicationComponents}>
            </Route>
          </Route>


          <Route path='/login'
            element={loginComponents(setToken)}>
          </Route>


          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="/dashboard" element={dashboard}></Route>
          </Route>

          <Route path='/dashboard' element={dashboard}></Route>

        </Routes>
      </Router>
    </div>);

}

export default App;
