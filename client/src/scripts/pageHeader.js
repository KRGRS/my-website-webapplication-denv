import React, { Component } from 'react';
import App from '../App';
const reactDOMServer = require('react-dom/server');
const HTMLToReactParser = require("html-to-react").Parser;

class PageHeader extends Component {

    constructor() {
        super();
    }

    render() {

        var HTMLElements = '<div class="row page-header"> <div class="col"></div> <div class="col"> <h1 id="pagetitle">CnCCutter</h1> </div> <div class="col"></div> <div> </div> </div>'; 
           

        const htmlToReactParser = new HTMLToReactParser();
        const reactElement = htmlToReactParser.parse(HTMLElements);
        return reactElement; 
    }
}

export default PageHeader; 