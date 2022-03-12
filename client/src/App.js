import React, { Component } from 'react';
import CncFrame from './scripts/cncFrame';
import PageHeader from './scripts/pageHeader.js';
import './css/style.css';
import MyNavbar from './scripts/Navbar';

class App extends Component {
  render() {
    return (<div>
      {/*<Helmet>
        <script src="./scripts/javasc.js" type="text/javascript"></script>
      </Helmet>*/}
      <MyNavbar />
      <PageHeader />
      <CncFrame />
    </div>);
  }
}

export default App;
