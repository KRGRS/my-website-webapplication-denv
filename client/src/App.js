import React, {Component} from 'react'; 
import Navbar from './scripts/header'; 
import CncFrame from './scripts/cncFrame';
import PageHeader from './scripts/pageHeader.js';
import './css/style.css';

class App extends Component {
  constructor(props){
    super(props); 

  }

  render(){
    return (<div> <PageHeader /><Navbar /><CncFrame />
    </div>); 
  }
}

export default App;
