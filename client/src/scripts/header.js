import React, { Component } from 'react';
import App from '../App';
const reactDOMServer = require('react-dom/server');
const HTMLToReactParser = require("html-to-react").Parser;

class Navbar extends Component {

    constructor() {
        super();
    }

    render() {

        var HTMLElements =
            '<nav class="navbar navbar-expand-sm bg-dark navbar-light"> <ul class="navbar-nav"> <li class="nav-item"> <div class="dropdown"> <a type="button" class="nav-item dropdown-list" data-toggle="dropdown"> Project </a> <div class="dropdown-menu"> <a class="dropdown-item" href="#">Create Project</a> <a class="dropdown-item" href="#">Open Project</a> <a class="dropdown-item" href="#">Close Project</a> </div> </div> </li> <li class="nav-item"> <div class="dropdown"> <a type="button" class="nav-item dropdown-list" data-toggle="dropdown"> View </a> <div class="dropdown-menu"> <a class="dropdown-item" href="#">Link 1</a> <a class="dropdown-item" href="#">Link 1</a> <a class="dropdown-item" href="#">Link 1</a> </div> </div> </li> <li class="nav-item"> <div class="dropdown"> <a type="button" class="nav-item dropdown-list" data-toggle="dropdown"> Extra </a> <div class="dropdown-menu"> <a class="dropdown-item" href="#">Link 1</a> <a class="dropdown-item" href="#">Link 1</a> <a class="dropdown-item" href="#">Link 1</a> </div> </div> </li> </ul> </nav>';

        const htmlToReactParser = new HTMLToReactParser();
        const reactElement = htmlToReactParser.parse(HTMLElements);
        return reactElement; 
    }
}

export default Navbar; 