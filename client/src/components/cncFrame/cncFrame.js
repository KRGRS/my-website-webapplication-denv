import React, { Component } from 'react';
import Canvas from '../canvas';
import {getAPICall} from '../../services/api.js'; 
import { CanvasProvider } from './canvasProvider';

export class CncFrame extends Component {
    /**
     * 
     * @param {Object} url 
     */
    constructor({name = undefined}) {
        super();
        this.canvProvider = new CanvasProvider(this);
        this.fullScreenState = false;
        this.changeFullScreenState = () => {
            this.fullScreenState ? this.fullScreenState = false : this.fullScreenState = true;
            this.forceUpdate();
        }
        if(name !== undefined){

        }

        this.saveFile = undefined; 
        this.DillFile = undefined; 
    }

    generateDrillFile(){

    }

    generateSaveFile(){
        let obj = {}
        
    }

    printHelloStatement() {
        console.log("Hello World!");
    }

    componentDidMount() {
        this.canvProvider.init();
    }

    render() {

        return (
            <div id="appFrame" className={this.fullScreenState ? 'fullscreen' : ''}>
                <div className="row">
                    <div className="col">
                        <div className='wood-div'>
                            <label htmlFor="woodWidth" className='wood-column'> Width of Wood:</label>
                            <input type="number" min="5" id="woodWidth" className='wood-column' step='10' />
                        </div>
                    </div>
                    <div className="col">
                        <div className='wood-div'>
                            <label htmlFor="woodHeight" className='wood-column'>Height of Wood:</label>
                            <input type="number" min="5" id="woodHeight" className='wood-column' />
                        </div>
                    </div>
                    <div className="col">
                        <div className="display-group">
                            <label className="label-display" htmlFor="xLineInput">xRow-Lines</label>
                            <input type="number" min="1" max="100" id="xLineInput" />
                            <label className="label-header" htmlFor="showLineX">Show lines? </label>
                            <input type="checkbox" id="showLineX" />
                        </div>
                    </div>
                    <div className="col">
                        <div className='display-group'>
                            <label className="label-display" htmlFor="yLineInput">yRow-Lines</label>
                            <input type="number" min="1" max="100" id="yLineInput" />
                            <label className="label-header" htmlFor="showLineY">Show lines? </label>
                            <input type="checkbox" id="showLineY" />
                        </div>

                    </div>

                    <div className="row buttonGroup">
                        <div className='col'>
                            <button className="arrow arrow-top left-appframe-corner" onClick={this.changeFullScreenState}></button></div>
                        <div className="col">
                            <div className="btn-group">
                                <button type="button" className="btn btn-secondary">Mirroring vertical</button>
                                <button type="button" className="btn btn-secondary">Mirroring horizontal</button>
                            </div>
                        </div>
                        <div className='col'>
                            <div className="btn-group">
                                <button type="button" className="btn btn-secondary">repeate pattern</button>
                            </div>
                        </div>
                        <div className='col'></div>
                    </div>

                    <div className="row buttonGroup">
                        <div className='col'></div>
                        <div className="col">
                            <div className="btn-group">
                                <button type="button" className="btn btn-secondary">choose outline</button>
                                <button type="button" className="btn btn-secondary">define cutout area</button>
                            </div>
                        </div>
                        <div className="col"></div>
                    </div>

                    <div className="row buttonGroup">
                        <div className="col-2">
                        </div>
                        <div className="col-8">
                            <div className="btn-group">
                                <button type="button" className="btn btn-secondary" onClick={this.canvProvider.selectCicrle.bind(this.canvProvider)}>Circle</button>
                                <button type="button" className="btn btn-secondary" onClick={this.printHelloStatement}>Triangle</button>
                                <button type="button" className="btn btn-secondary" onClick={this.canvProvider.selectRectangle.bind(this.canvProvider)}>Rectangle</button>
                                <button type="button" className="btn btn-secondary" onClick={this.canvProvider.selectLine.bind(this.canvProvider)}>Line</button>
                            </div>
                        </div>
                        <div className="col-2">
                        </div>

                    </div>


                    <div className="row canvasRow">
                        <div className="col-3 detailRow">
                            <h3 className="details-header">Details:</h3>
                            <div id="details-list">
                                <div className='overflow-wrapper'>
                                    {this.canvProvider.detailsPanvasListReact}
                                </div>
                            </div>
                        </div>
                        <div className="col" id="drawingCanvasDiv">
                            <Canvas providerref={this.canvProvider}></Canvas>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col"></div>
                        <div className="col"></div>
                        <div className="col"></div>
                        <div className="col">
                            <button type="button" className="btn btn-secondary finishButton" onClick={this.printHelloStatement}>Export</button>
                        </div>
                        <div className="col"></div>
                    </div>

                </div>
            </div >)
    };
}

/*function createRotMatrix(a) {
    let angle = degreesToRad(a);
    return [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]];
}

function degreesToRad(deg) {
    return deg * Math.PI / 180;
}

function radToDegree(rad) {
    return rad * 57.2958;
}

function calculateVector(zp, ap) {
    return [zp[0] - ap[0], zp[1] - ap[1]];
}

function calcVectorLength(v1) {
    return Math.sqrt(Math.pow(v1[0], 2) + Math.pow(v1[1], 2));
}

function calculateDistance(x1, y1, x2, y2) {
    var xdif = Math.pow(x1 - x2, 2);
    var ydif = Math.pow(y1 - y2, 2);

    return Math.sqrt(xdif + ydif);
}*/ 