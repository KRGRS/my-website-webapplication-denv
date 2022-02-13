import React, { Component } from 'react';
import App from '../App';
const reactDOMServer = require('react-dom/server');
const HTMLToReactParser = require("html-to-react").Parser;

class CncFrame extends Component {

    constructor() {
        super();
    }

    render() {
        var htmlParser = new HTMLToReactParser(); 
        return htmlParser.parse('<div class="row"> <div class="col"> <div> <label for="woodWidth"> Width of Wood:</label> <input type="number" min="5" id="woodWidth"> </div> </div> <div class="col"> <div> <label for="woodHeight">Height of Wood:</label> <input type="number" min="5" id="woodHeight"> </div> </div> <div class="col"> <div class="display-group"> <label class="label-display" for="xLineInput">xRow-Lines</label> <input type="number" min="1" max="100" id="xLineInput"> <label class="label-header" for="showLineX">Show lines? </label> <input type="checkbox" id="showLineX"> </div> </div> <div class="col"> <label class="label-display" for="yLineInput">yRow-Lines</label> <input type="number" min="1" max="100" id="yLineInput"> <label class="label-header" for="showLineY">Show lines? </label> <input type="checkbox" id="showLineY"> </div> </div> <div class="row buttonGroup"> <div class="col"> <div class="btn-group"> <button type="button" class="btn btn-secondary">Mirroring vertical</button> <button type="button" class="btn btn-secondary">Mirroring horizontal</button> <button type="button" class="btn btn-secondary">choose outline</button> <button type="button" class="btn btn-secondary">define cutout area</button> <button type="button" class="btn btn-secondary">repeate pattern</button> </div> </div> </div> <div class="row buttonGroup"> <div class="col-2"> </div> <div class="col-8"> <div class="btn-group"> <button type="button" class="btn btn-primary" onclick="selectCicrle()">Circle</button> <button type="button" class="btn btn-primary">Triangle</button> <button type="button" class="btn btn-primary" onclick="selectRectangle()">Rectangle</button> <button type="button" class="btn btn-primary" onclick="selectLine()">Line</button> </div> </div> <div class="col-2"> </div> </div> <div class="row canvasRow"> <div class="col-4 detailRow"> <h3 class="details-header">Details:</h3> <ul id="details-list"> <li> <div class="detailsListItem"> <label class="details-item-label">Point x</label> <input type="number"> <br> <label class="details-item-label">Point x</label> <input type="number"> </div> </li> <li> <div class="detailsListItem"> <label class="details-item-label">Point Y</label> <input type="number"> </div> </li> <li> <div class="detailsListItem"> <label class="details-item-label">Point Z</label> <input type="number"> </div>> </li> </ul> </div> <div class="col" id="drawingCanvasDiv"> <canvas id="drawingCanvas"> </canvas> </div> </div> <div class="row"> <div class="col"></div> <div class="col"></div> <div class="col"></div> <div class="col"> <button type="button" class="btn btn-secondary finishButton" onclick="">Export</button> </div> <div class="col"></div> </div> </div>'); 
    }
}

export default CncFrame; 