import {Grid, Rectangle, Line, Circle, Shape, Point} from './shapes.js'; 


export class CanvasProvider {

    constructor(reactComp) {

        //react Component 
        this.reactComponent = reactComp;

        //canvas Values 
        this.canvHeight = 0;
        this.canvWidth = 0;

        //details Panvas list 
        this.detailsPanvasList = [];
        this.detailsPanvasListReact = (<div><p>No element is selected</p></div>);

        //button values
        this.xRowLinesScale = 0;
        this.yRowLinesScale = 0;
        this.showXLines = 0;
        this.showYLines = 0;
        this.wWidth = 0;
        this.wHeight = 0;

        //control vars for drawing functions 
        this.drawingPoints = [];
        this.inDrawingConfiguration = false;
        this.drawingInterval = undefined;

        //styles 
        this.standartStyle = "rgba(0, 0, 0, 1)";
        this.selectedStyle = "rgba(245, 61, 61, 1)";

        //drawing intveral 
        this.interval = 0;
        this.objOnCanvas = [];
        this.temporaryObj = [];
        this.inDrawingConfObj = undefined;
        this.drawingLoopStop = false;
        this.grid = undefined;


        // canvas drawing vars 
        this.drawingButtonSelected = false;
        this.countOfPoints = 0;
        this.type = undefined;
        this.points = [];
        this.scaleX = 0.5;
        this.scaleY = 0.5;
        this.mouseX = 0;
        this.mouseY = 0;
        this.drawXLines = true;
        this.drawYLines = true;
        this.xLineScale = 10;
        this.yLineScale = 10;

        //canvas reference 
        this.canv = undefined;
    }

    init() {
        //initialize all variables 
        this.canv = document.getElementById('drawingCanvas');

        if (this.canv === undefined) {
            return;
        }

        this.ctx = this.canv.getContext('2d');
        this.ctx.font = '18px serif';
        this.ctx.scale(this.scaleX, this.scaleY);

        this.detailsPanvasList = document.getElementById("details-list");
        this.xRowLinesScale = document.getElementById("xLineInput");
        this.yRowLinesScale = document.getElementById("yLineInput");
        this.showXLines = document.getElementById("showLineX");
        this.showYLines = document.getElementById("showLineY");
        this.wWidth = document.getElementById("woodWidth");
        this.wHeight = document.getElementById("woodHeight");

        this.xRowLinesScale.defaultValue = 10;
        this.yRowLinesScale.defaultValue = 10;
        this.showXLines.checked = true;
        this.showYLines.checked = true;
        this.wWidth.defaultValue = 5;
        this.wHeight.defaultValue = 5;

        this.canvHeight = 354;//Math.round(canv.getBoundingClientRect().height);
        this.canvWidth = 690;//Math.round(canv.getBoundingClientRect().width);

        //this.canv.height = 354;
        //this.canv.width = 690;

        this.grid = new Grid(10, 10, true, true, 0, 0, 0, 0, 5, 5, this.canvHeight, this.canvWidth);

        //initialize all listeners  
        this.canv.addEventListener('mousedown', this.mousePressed.bind(this));

        this.showXLines.addEventListener('input', () => {
            this.grid.xS = !this.grid.xS;
            this.grid.scaleGrid();
        });

        this.showYLines.addEventListener('input', () => {
            this.grid.yS = !this.grid.yS;
            this.grid.scaleGrid();
        });

        this.xRowLinesScale.addEventListener('input', () => {
            this.grid.xScale = this.xRowLinesScale.value;
            this.grid.scaleGrid();
        });

        this.yRowLinesScale.addEventListener('input', () => {
            this.grid.yScale = this.yRowLinesScale.value;
            this.grid.scaleGrid();
        });

        this.wWidth.addEventListener('input', () => {
            this.grid.woodWidth = this.wWidth.value;
        });

        this.wHeight.addEventListener('input', () => {
            this.grid.woodHeight = this.wHeight.value;
        });

        this.canv.addEventListener('mousemove', (e) => {
            let pos = this.getMousePosition(e);


            this.mouseX = pos[0] * (1 / this.scaleX);
            this.mouseY = pos[1] * (1 / this.scaleY);

        })

        //add all elemens to scene 
        this.objOnCanvas.push(this.grid);

        //this.interval = setInterval(this.draw, 100);
    }

    printHelloStatement() {
        console.log("Hellolololololololololololololo");
    }


    drawPointOnMousePosition(pos, ctx) {
        let point = new Point(pos, "rgba(255, 0, 0, 1)");
        this.temporaryObj.push(point);
        //point.draw(ctx);
    }

    inCircleConfiguration() {
        if (!this.drawingLoopStop) {
            if (this.drawingPoints.length === 2) {
                this.drawingLoopStop = true;
                let circle = new Circle([this.mouseX, this.mouseY], this.drawingPoints[0], this.standartStyle);
                circle.configurePoints();

                this.objOnCanvas.push(circle);

                this.temporaryObj = [];
                this.drawingPoints = [];

                this.countOfPoints = 0;
                this.drawingButtonSelected = false;
                this.inDrawingConfObj = undefined;
                this.inDrawingConfiguration = false;

                this.detailsPanvasListReact = this.create_details_panel_elems(circle);
                this.reactComponent.forceUpdate();
                this.drawingInterval = clearInterval(this.drawingInterval);
            } else {
                this.inDrawingConfObj.setNewPoints([this.mouseX, this.mouseY]);
            }
        }
    }

    inRectangleConfiguration() {
        if (!this.drawingLoopStop) {
            if (this.drawingPoints.length === 4) {
                this.drawingLoopStop = true;

                this.inDrawingConfObj.finish();
                this.objOnCanvas.push(this.inDrawingConfObj);

                this.detailsPanvasListReact = this.create_details_panel_elems(this.inDrawingConfObj);
                this.reactComponent.forceUpdate();

                this.temporaryObj = [];
                this.drawingPoints = [];

                this.countOfPoints = 0;
                this.drawingButtonSelected = false;
                this.inDrawingConfObj = undefined;
                this.inDrawingConfiguration = false;

                this.drawingInterval = clearInterval(this.drawingInterval);
            }
        }
    }

    inLineConfiguration() {
        if (!this.drawingLoopStop) {
            if (this.inDrawingConfObj.finished) {
                this.drawingLoopStop = true;
                this.objOnCanvas.push(this.inDrawingConfObj);

                this.detailsPanvasListReact = this.create_details_panel_elems(this.inDrawingConfObj);
                this.reactComponent.forceUpdate();

                this.temporaryObj = [];
                this.drawingPoints = [];

                this.countOfPoints = 0;
                this.inDrawingConfObj = undefined;
                this.inDrawingConfiguration = false;
                this.drawingButtonSelected = false;

                this.drawingInterval = clearInterval(this.drawingInterval)
            }
        }
    }

    setAttributes(el, attrs) {
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }

    /**
     * change number of points or angle of the circle (polygone) 0: number of points 1: angle  
     * @param {Circle} obj 
     * @param {Number} value 
     * @param {Number} type 
     */
    changeSpecialAttributesOfCircles(obj, value, type) {
        if (type === 0) {
            obj.countOfPoints = value;
        } else {
            obj.rotationAngle = value;
        }

        obj.changeAttributes();
    }

    /**
     * change Attributes for circle objects 
     * @param {Circle} obj reference to the object which has to change 
     * @param {Number} value the new value for the attribute
     * @param {Number} index index of coordinates to change (0 = X, 1 = Y)
     * @param {Number} type -1 = radPoint; 0 < index of Point 
     */
    changeAttributesOfCircles(obj, value, index, type) {
        if (type === -1) {
            obj.radPoint[index] = parseInt(value);
        } else {
            obj.points[type][index] = parseInt(value);
        }
        obj.changeAttributes();
    }

    /**
     * Function to change a point
     * @param {Rectangle} obj 
     * @param {Number} value 
     * @param {Number} index 
     * @param {Number} type
     */
    changeAttributesOfRect(obj, value, index, type) {
        if (index === -1) {
            obj.changePoints(value, type);
        } else {
            obj.points[index][type] = value;
        }
    }

    /**
     * -1 == rotation; 0< == changing lines 
     * @param {Rectangle} obj 
     * @param {Number} value 
     * @param {Number} index 
     * @param {Number} type -1 rot; 0< lines 
     * @returns undefined
     */
    changeSpecialAttributesOfRect(obj, value, index, type) {
        if (type === -1) {
            obj.rotateCrucialPoint(value);
        } else {
            obj.changeLineValues(value, type);
        }
    }

    /** 
     * render details in correspondance to type 
     * @param {String} param type as already multiple defined in lowercase letters 
     * @param {} elem obj which values are to show 
     * 
    */
    renderSwitch(param, elem) {

        //console.log(elem);
        //console.log(param); 

        switch (param) {
            case 'circle': return (
                <div className="detailsList">
                    <div>
                        <div className="details-list-item">
                            <label className="details-item-label-top">RadPoint</label>
                            <br></br>
                            <label className="details-item-label"> Point X: </label>
                            <input type="number" defaultValue={elem.radPoint[0]} onChange={(e) => this.changeAttributesOfCircles(elem, e.target.value, 0, -1)}></input>
                            <br></br>
                            <label className="details-item-label"> Point Y: </label>
                            <input type="number" defaultValue={elem.radPoint[1]} onChange={(e) => this.changeAttributesOfCircles(elem, e.target.value, 1, -1)}></input>
                        </div>
                        {elem.points.map((item, ind) => {
                            return (<div className="details-list-item" key={ind}>
                                <label className="details-item-label-top">Point {ind}</label>
                                <br></br>
                                <label className="details-item-label"> Point X: </label>
                                <input type="number" defaultValue={item[0]} readOnly></input>
                                <br></br>
                                <label className="details-item-label"> Point Y: </label>
                                <input type="number" defaultValue={item[1]} readOnly></input>
                            </div>);
                        })}

                        <div className="details-list-item">
                            <label className="details-item-label-top">Count of Points: </label>
                            <br></br>
                            <label className="details-item-label"> Number: </label>
                            <input type="number" defaultValue={elem.countOfPoints} onChange={(e) => this.changeSpecialAttributesOfCircles(elem, e.target.value, 0)}></input>
                        </div>

                        <div className="details-list-item">
                            <label className="details-item-label-top">Rotation Angle: </label>
                            <br></br>
                            <label className="details-item-label"> Angle in degrees: </label>
                            <input type="number" defaultValue={elem.rotationAngle} onChange={(e) => this.changeSpecialAttributesOfCircles(elem, e.target.value, 1)}></input>
                        </div>

                    </div>
                </div>);

            case 'line':
                return (
                    <div className="detailsList">
                        <div>
                            {elem.points.map((item, ind) => {
                                return (<div className="details-list-item" key={ind}>
                                    <label className="details-item-label-top">Point {ind}</label>
                                    <br></br>
                                    <label className="details-item-label"> Point X: </label>
                                    <input type="number" defaultValue={item[0]}></input>
                                    <br></br>
                                    <label className="details-item-label"> Point Y: </label>
                                    <input type="number" defaultValue={item[1]}></input>
                                </div>);
                            })}
                            {elem.lines.map((item, ind) => {
                                return (
                                    <div className="details-list-item" key={ind}>
                                        <label className="details-item-label-top">Line {ind}: </label>
                                        <br></br>
                                        <label className="details-item-label"> Length </label>
                                        <input type="number" defaultValue={item}></input>
                                        <br></br>
                                    </div>
                                );
                            })}
                        </div>
                    </div>)

            case 'rectangle':

                return (
                    <div className="detailsList">
                        <div>
                            <div className="details-list-item">
                                <label className="details-item-label-top">Middle Point:</label>
                                <br></br>
                                <label className="details-item-label"> Point X: </label>
                                <input type="number" defaultValue={elem.middlePoint[0]} onChange={(e) => { this.changeAttributesOfRect(elem, e.target.value, -1, 0) }}></input>
                                <br></br>
                                <label className="details-item-label"> Point Y: </label>
                                <input type="number" defaultValue={elem.middlePoint[1]} onChange={(e) => { this.changeAttributesOfRect(elem, e.target.value, -1, 1) }}></input>
                            </div>


                            {elem.points.map((item, ind) => {
                                return (
                                    <div className="details-list-item" key={ind}>
                                        <label className="details-item-label-top">Point {ind}:</label>
                                        <br></br>
                                        <label className="details-item-label"> Point X: </label>
                                        <input type="number" defaultValue={item[0]} onChange={(e) => { this.changeAttributesOfRect(elem, e.target.value, ind, 0) }}></input>
                                        <br></br>
                                        <label className="details-item-label"> Point Y: </label>
                                        <input type="number" defaultValue={item[1]} onChange={(e) => { this.changeAttributesOfRect(elem, e.target.value, ind, 1) }}></input>
                                    </div>
                                );
                            })}

                            {elem.lines.map((item, ind) => {
                                return (
                                    <div className="details-list-item" key={ind}>
                                        <label className="details-item-label-top">Line {ind}: </label>
                                        <br></br>
                                        <label className="details-item-label"> Length </label>
                                        <input type="number" defaultValue={item} onChange={(e) => { this.changeSpecialAttributesOfRect(elem, e.target.value, 0, ind) }}></input>
                                        <br></br>
                                    </div>
                                );
                            })}
                            <div className="details-list-item">
                                <label className="details-item-label-top"> Rotation (in degrees): </label>
                                <label className="details-item-label"></label>
                                <input type="number" defaultValue={elem.rotationAngle} onChange={(e) => { this.changeSpecialAttributesOfRect(elem, e.target.value, 0, -1) }}></input>
                            </div>
                        </div>
                    </div>);

            default:
                return (<div><p>No object is selected</p></div>);
        }
    }

    create_details_panel_elems(elem) {
        return (this.renderSwitch(this.type, elem));
    }

    selectLine() {
        this.drawingButtonSelected = true;
        this.type = 'line';
    }

    selectCicrle() {
        this.drawingButtonSelected = true;
        this.type = 'circle';
    }

    selectRectangle() {
        this.drawingButtonSelected = true;
        this.type = 'rectangle';
    }

    draw(ctx) {
        if (ctx !== undefined) {
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fillRect(0, 0, this.canvWidth, this.canvHeight);
            this.objOnCanvas.forEach((item) => {
                item.draw(ctx);
            })

            this.temporaryObj.forEach((item) => {
                item.draw(ctx);
            })
        }
    }

    getMousePosition(evt) {
        var mouseX = evt.offsetX * this.canv.width / this.canv.clientWidth | 0;
        var mouseY = evt.offsetY * this.canv.height / this.canv.clientHeight | 0;

        return [mouseX, mouseY];
    }

    getAbsolutMousePosition(event) {
        return [event.clientX, event.clientY];
    }

    mousePressed(e) {
        //test if drawing button is selected 
        if (this.drawingButtonSelected) {

            this.drawingPoints.push([this.mouseX, this.mouseY]);
            this.points.push([this.mouseX, this.mouseY]);

            if (this.drawingInterval === undefined) {

                //switch on button type

                switch (this.type) {
                    case 'circle':
                        this.inDrawingConfObj = new Circle([this.mouseX, this.mouseY], this.drawingPoints[0], this.standartStyle);
                        this.temporaryObj.push(this.inDrawingConfObj);
                        this.drawingLoopStop = false;
                        this.drawingInterval = setInterval(this.inCircleConfiguration.bind(this), 100);
                        break;

                    case 'line':
                        this.inDrawingConfObj = new Line(this.drawingPoints[0], this.standartStyle);
                        this.temporaryObj.push(this.inDrawingConfObj);
                        this.drawingLoopStop = false;
                        this.drawingInterval = setInterval(this.inLineConfiguration.bind(this), 100);
                        this.detailsPanvasListReact = (<button id="finishButton" className="Finish" onClick={() => { this.inDrawingConfObj.finishLine() }}> Finish </button>);
                        this.reactComponent.forceUpdate();
                        break;

                    case 'rectangle':
                        this.inDrawingConfObj = new Rectangle(this.drawingPoints[0], this.standartStyle);
                        this.temporaryObj.push(this.inDrawingConfObj);

                        this.drawingInterval = setInterval(this.inRectangleConfiguration.bind(this), 100);
                        this.drawingLoopStop = false;
                        break;

                    default:
                        //console.log("Hello World");
                        break;
                }


            } else {
                switch (this.type) {
                    case 'line':
                        this.inDrawingConfObj.points.push([this.mouseX, this.mouseY]);
                        break;

                    case 'rectangle':
                        this.inDrawingConfObj.points.push([this.mouseX, this.mouseY]);
                        break;

                    default:
                    //console.log("Hello world2!");
                }
            }
        }
    };
}