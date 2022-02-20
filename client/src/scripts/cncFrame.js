import React, { Component, createRef, useRef } from 'react';
import Canvas from './canvas';

//classes 
class Shape {
    constructor(p, sty) {
        this.points = [];
        if (Array.isArray(p)) {
            p.forEach((item) => {
                this.points.push(item);
            })
        } else {
            this.points.push(p);
        }

        this.style = sty;
        this.detailPanelInputs = [];

        this.changeAttributes = () => {
            for (let i = 0, j = 0; i < this.points.length; i++) {
                this.points[i][0] = this.detailPanelInputs[j++].value;
                this.points[i][1] = this.detailPanelInputs[j++].value;
            }
        };
    }

    addDetailListeners(inp) {
        this.detailPanelInputs.push(inp);
    }

    changeStyle(sty) {
        this.style = sty;
    }

    draw(ctx) {
        ctx.fillStyle = this.style;
        ctx.beginPath();
        ctx.moveTo(this.points[0][0], this.points[0][1]);
        ctx.arc(this.points[0][0], this.points[0][1], 2, 0, 2 * Math.PI);
        ctx.fillText('0', this.points[0][0], this.points[0][1]);

        for (let i = 1; i < this.points.length; i += 1) {
            let point2 = this.points[i];

            ctx.arc(point2[0], point2[1], 2, 0, 2 * Math.PI);

            ctx.lineTo(point2[0], point2[1]);

            ctx.fillText(i, point2[0], point2[1]);

            ctx.stroke();
        }
    }
}

class Line extends Shape {
    constructor(p, sty) {
        super(p, sty);
    }

    returnDetails() {
        var details = [];
        this.points.forEach((item) => {
            details.push(item);
        });

        return details;
    }
}

class Point {
    constructor(p, sty) {
        this.style = sty;
        this.point = p;
    }

    draw(ctx) {
        ctx.fillStyle = this.style;
        ctx.fillRect(this.point[0], this.point[1], 10, 10);
    }
}

class Circle {
    constructor(points, radPoint, sty) {
        this.points = [];
        this.points.push(points);
        this.radPoint = radPoint;
        this.radius = calculateDistance(this.points[0][0], this.points[0][1], this.radPoint[0], this.radPoint[1]);
        this.style = sty;
        this.countOfPoints = 5;
        let helpPoint = [this.radPoint[0] + this.radius, this.radPoint[1]];
        let helpV1 = calculateVector(this.points[0], this.radPoint);
        let helpV2 = calculateVector(helpPoint, this.radPoint);
        this.rotationAngle = radToDegree(calcAngleBVector(helpV1, helpV2));
        this.detailPanelInputs = [];

        this.changeAttributes = () => {
            this.xTranslation = parseInt(this.detailPanelInputs[0].value);
            this.yTranslation = parseInt(this.detailPanelInputs[1].value);
            this.rotationAngle = parseInt(this.detailPanelInputs[2].value);
            this.countOfPoints = parseInt(this.detailPanelInputs[3].value);
            this.radius = parseInt(this.detailPanelInputs[4].value);

            this.changeCoords();
            this.changeRadiusOfCircle();
            this.rotateCrucialPoint();
            this.configurePoints();

            if (this.points[0] == this.points[1]) {
                this.points = [this.points[0]];
                this.configurePoints();
            }
        };
    }

    changeCoords() {

        if (!this.radPoint[0] < this.xTranslation) {
            this.xTranslation = (this.xTranslation - this.radPoint[0]);
        } else {
            this.xTranslation = -(this.xTranslation - this.radPoint[0]);
        }

        if (!this.radPoint[1] < this.yTranslation) {
            this.yTranslation = (this.yTranslation - this.radPoint[1]);
        } else {
            this.yTranslation = -(this.yTranslation - this.radPoint[1]);
        }

        this.radPoint[0] += this.xTranslation;
        this.radPoint[1] += this.yTranslation;

        this.points[0][0] += this.xTranslation;
        this.points[0][1] += this.yTranslation;

        this.points = [this.points[0]];
    }

    changeRadiusOfCircle() {
        let vectorRP = calculateVector(this.points[0], this.radPoint);

        this.radius = isNaN(this.radius) ? 0.3 : this.radius;
        let quot = this.radius / this.calcVectorLength(vectorRP);

        if (!isFinite(quot) || isNaN(quot)) {
            quot = 0.3;
        }

        if (vectorRP[0] === 0 && vectorRP[1] === 0) {
            vectorRP[0] = this.radius;
        }

        this.points[0][0] = this.radPoint[0] + vectorRP[0] * quot;
        this.points[0][1] = this.radPoint[1] + vectorRP[1] * quot;

        this.radius = calculateDistance(this.points[0][0], this.points[0][1], this.radPoint[0], this.radPoint[1]);
        this.vectorUR = calculateVector(this.radPoint, [0, 0]);
        this.vectorRP = calculateVector(this.points[0], this.radPoint);
    }

    rotateCrucialPoint() {
        let point = [0, 0];

        point[0] = this.radius;
        point[1] = 0;

        let rot = createRotMatrix(this.rotationAngle);

        let newX = point[0] * rot[0][0] + point[1] * rot[0][1];
        let newY = point[0] * rot[1][0] + point[1] * rot[1][1];

        newX = Math.round(this.vectorUR[0] + newX);
        newY = Math.round(this.vectorUR[1] + newY);

        this.points[0][0] = newX;
        this.points[0][1] = newY;
    }

    addDetailListeners(obj) {
        this.detailPanelInputs.push(obj);
    }

    configurePoints() {
        let angle = 360 / this.countOfPoints;

        let point = [0, 0];
        this.vectorUR = calculateVector(this.radPoint, [0, 0]);
        this.vectorRP = calculateVector(this.points[0], this.radPoint);

        for (let i = angle; i < 360; i += angle) {

            point[0] = this.vectorRP[0];
            point[1] = this.vectorRP[1];

            let rot = createRotMatrix(i);

            let newX = point[0] * rot[0][0] + point[1] * rot[0][1];
            let newY = point[0] * rot[1][0] + point[1] * rot[1][1];

            newX = Math.round(this.vectorUR[0] + newX);
            newY = Math.round(this.vectorUR[1] + newY);

            this.points.push([newX, newY]);
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.style;

        ctx.beginPath();
        ctx.arc(this.radPoint[0], this.radPoint[1], this.radius, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.fillStyle = this.style;

        ctx.beginPath();
        ctx.arc(this.radPoint[0], this.radPoint[1], 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = this.style;

        this.points.forEach((item) => {
            ctx.beginPath();
            ctx.arc(item[0], item[1], 2, 0, 2 * Math.PI);
            ctx.fill();
        })

        ctx.stroke();

        ctx.fillStyle = this.style;

        ctx.beginPath()
        ctx.moveTo(this.points[0][0], this.points[0][1]);

        this.points.forEach((item) => {
            ctx.lineTo(item[0], item[1]);
        })

        ctx.lineTo(this.points[0][0], this.points[0][1]);
        ctx.stroke();
    }

    setNewPoints(p1) {
        this.points = p1;
        this.radius = calculateDistance(p1[0], p1[1], this.radPoint[0], this.radPoint[1]);
    }

    returnDetails() {
        var details = [];

        details.push(1);

        details.push(this.radPoint);

        details.push([this.rotationAngle, 'Rotation:']);
        details.push([this.countOfPoints, 'Count of Points:']);
        details.push([this.radius, "Radius of Circle"]);

        return details;
    }

    /*changeAttribute(obj) {
        switch (obj.name) {
            case 'Rotation':
                this.rotationAngle = obj.value;
                break;
    
            case 'cPoints':
                this.countOfPoints = obj.value;
                break;
        }
    
        console.log(obj);
    }*/

    pointsChangeOnDetails(oldP, newValue) {
        let pIndex = this.points.findIndex(oldP);
        this.points[pIndex] = newValue;
    }
}

class Grid {
    constructor(xSc, ySc, xS, yS, fX1, fX2, fY1, fY2, wH, wW, cH, cW) {
        this.xScale = xSc;
        this.yScale = ySc;
        this.xS = xS;
        this.yS = yS;
        this.widthPoints = [];
        this.heightPoints = [];
        this.style = "rgba(0, 0, 0, 0.1)";
        this.fX1 = fX1;
        this.fX2 = fX2;
        this.fY1 = fY1;
        this.fY2 = fY2;
        this.woodHeight = wH;
        this.woodWidth = wW;
        this.canvHeight = cH;
        this.canvWidth = cW;

        this.scaleGrid();
    }

    drawWoodenFrame(ctx) {
        ctx.fillStyle = "rgba(238,232,170, 1)";
        ctx.fillRect(0, 0, this.woodWidth, this.woodHeight);

        ctx.fillRect(50, 50, 10, 10);
    }

    scaleGrid() {

        let xPoints = [];
        if (this.xS) {

            let div = this.canvHeight / this.xScale;

            for (let i = 0; i < this.xScale + div; i += 1) {
                var p = [];
                var p2 = [];

                p.push(0);
                p.push(i * div);

                p2.push(this.canvWidth);
                p2.push(i * div);

                xPoints.push(p);
                xPoints.push(p2);
            }
        }

        let yPoints = [];
        if (this.yS) {
            let div2 = this.canvWidth / this.yScale;
            for (let i = 0; i < this.canvHeight + div2; i += 1) {
                var p = [];
                var p2 = [];

                p.push(i * div2);
                p.push(0);

                p2.push(i * div2);
                p2.push(this.canvHeight);

                yPoints.push(p);
                yPoints.push(p2);
            }
        }

        this.widthPoints = xPoints;
        this.heightPoints = yPoints;
    }

    draw(ctx) {
        ctx.fillStyle = this.style;
        ctx.lineWidth = 1;
        for (let i = 0; i < this.widthPoints.length - 2; i += 2) {
            ctx.beginPath();
            let point1 = this.widthPoints[i];
            let point2 = this.widthPoints[i + 1];

            ctx.moveTo(point1[0], point1[1]);
            ctx.lineTo(point2[0], point2[1]);

            ctx.stroke();
        }

        for (let i = 0; i < this.heightPoints.length - 2; i += 2) {
            ctx.beginPath();
            let point1 = this.heightPoints[i];
            let point2 = this.heightPoints[i + 1];

            ctx.moveTo(point1[0], point1[1]);
            ctx.lineTo(point2[0], point2[1]);

            ctx.stroke();
        }

        this.drawWoodenFrame(ctx);
    }
}

class Rectangle extends Shape {
    constructor(p, sty) {
        super(p, sty);

        this.middlePoint = this.calculateMiddlePoint();
        this.lines = this.calculateLineLength();
        this.rotationAngle = this.calculateRotation();
    }

    calculateRotation() {
        let hp = this.middlePoint;
        hp[0] += this.lines[0] / 2;

        let v1 = this.calculateVector(hp, this.middlePoint);
        let v2 = this.calculateVector(this.points[0], this.middlePoint);

        return this.calcAngleBVector(v1, v2);
    }

    calculateLineLength() {
        let lines = [];

        lines.push(this.calcVectorLength(this.calculateVector(this.points[0], this.points[1])));
        lines.push(this.calcVectorLength(this.calculateVector(this.points[1], this.points[2])));
        lines.push(this.calcVectorLength(this.calculateVector(this.points[2], this.points[3])));
        lines.push(this.calcVectorLength(this.calculateVector(this.points[3], this.points[0])));

        return lines;
    }

    returnDetails() {
        var details = [];
        details.push(5);
        this.points.forEach((item) => {
            details.push(item);
        })
        details.push(this.middlePoint);

        details.push([this.rotationAngle, 'Rotation:']);

        return details;
    }

    calculateMiddlePoint() {
        let v1 = this.calculateVector(this.points[3], this.points[1]);
        let v2 = this.calculateVector(this.points[2], this.points[0]);

        let p1 = [this.points[0][0] + v2[0], this.points[0][1] + v2[1]];
        let p2 = [this.points[1][0] + v1[0], this.points[1][1] + v1[1]];

        if (p1[0] == p2[0] && p1[1] == p2[1]) {
            this.middlePoint = p1;
        } else {
            alert("Something is not right");
        }
    }

}


class CanvasProvider {

    constructor() {
        //canvas Values 
        this.canvHeight = 0;
        this.canvWidth = 0;

        //details Panvas list 
        this.detailsPanvasList = [];

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
        this.scaleX = 0;
        this.scaleY = 0;
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


            this.mouseX = pos[0];
            this.mouseY = pos[1];
            console.log(pos);

        })

        //add all elemens to scene 
        this.objOnCanvas.push(this.grid);

        //this.interval = setInterval(this.draw, 100);
    }

    //functions

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
                this.drawingInterval = undefined;

                this.create_details_panel_elems(circle);
                clearInterval(this.drawingInterval);
            } else {
                this.inDrawingConfObj.setNewPoints([this.mouseX, this.mouseY]);
            }
        }
    }

    inRectangleConfiguration() {
        if (!this.drawingLoopStop) {
            if (this.drawingPoints.length === 4) {
                this.drawingLoopStop = true;

                let rect = new Rectangle(this.drawingPoints, this.standartStyle);
                this.objOnCanvas.push(rect);

                this.temporaryObj = [];
                this.drawingPoints = [];

                this.countOfPoints = 0;
                this.drawingButtonSelected = false;
                this.inDrawingConfObj = undefined;
                this.inDrawingConfiguration = false;
                this.drawingInterval = undefined;

                this.create_details_panel_elems(rect);
                clearInterval(this.drawingInterval);
            }
        }
    }

    setAttributes(el, attrs) {
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }

    create_elem_adj(elem, cls, value, id) {
        var el = document.createElement(elem);

        if (cls != undefined) {
            el.classList.add(cls);
        }

        if (value != undefined) {
            if (elem == 'label') {
                el.innerHTML = value;
            } else {
                el.value = value;
            }
        }

        if (id != undefined) {
            el.id = id;
        }

        return el;
    }

    create_input_elem(type, defV) {
        var el = document.createElement('input');
        el.type = type;

        el.value = defV;
        return el;
    }

    create_details_panel_elems(elem) {
        /*
        while (detailsPanvasList.firstChild) {
            detailsPanvasList.removeChild(detailsPanvasList.lastChild);
        }
 
        objOnCanvas.forEach((elem) => {
            elem.style = standartStyle;
        })
 
        elem.style = selectedStyle;
 
        switch (type) {
            case 'circle':
                var tts = elem.returnDetails();
                var detailsElem = [];
 
                for (let i = 1; i < tts.length; i++) {
                    var div = create_elem_adj('div', 'detailsListItem', undefined, undefined);
                    var list = create_elem_adj('li', undefined, undefined, undefined);
 
                    if (i > tts[0]) {
                        var label = create_elem_adj('label', 'details-item-label', tts[i][1], undefined);
                        var inp = create_input_elem('number', tts[i][0]);
 
                        elem.addDetailListeners(inp);
 
                        inp.addEventListener("input", elem.changeAttributes);
                        inp.setAttribute("step", 0.1);
 
                        div.appendChild(label);
                        div.appendChild(inp);
                    } else {
                        for (let j = 0; j < 2; j++) {
                            var label = create_elem_adj('label', 'details-item-label', j == 0 ? 'Point x:' : 'Point Y:', undefined);
                            var inp = create_input_elem('number', tts[i][j]);
                            inp.setAttribute("step", 0.1);
                            elem.addDetailListeners(inp);
                            inp.addEventListener("input", elem.changeAttributes);
                            var lb = create_elem_adj('br', undefined, undefined, undefined);
 
                            div.appendChild(label);
                            div.appendChild(inp);
                            div.appendChild(lb);
                        }
                    }
 
                    list.appendChild(div);
                    detailsElem.push(list);
                }
 
                detailsElem.forEach((item) => {
                    detailsPanvasList.appendChild(item);
                })
                break;
 
            case 'line':
                var tts = elem.returnDetails();
                var detailsElem = [];
 
                console.log(tts);
 
                for (let i = 0; i < tts.length; i++) {
                    var div = create_elem_adj('div', 'detailsListItem', undefined, undefined);
                    var list = create_elem_adj('li', undefined, undefined, undefined);
 
                    for (let j = 0; j < 2; j++) {
                        var label = create_elem_adj('label', 'details-item-label', j == 0 ? 'Point x:' + i : 'Point Y:' + i, undefined);
                        var inp = create_input_elem('number', tts[i][j]);
                        inp.setAttribute("step", 0.1);
                        elem.addDetailListeners(inp);
                        inp.addEventListener("input", elem.changeAttributes);
                        var lb = create_elem_adj('br', undefined, undefined, undefined);
 
                        div.appendChild(label);
                        div.appendChild(inp);
                        div.appendChild(lb);
                    }
 
                    list.appendChild(div);
                    detailsElem.push(list);
                }
 
                detailsElem.forEach((item) => {
                    detailsPanvasList.appendChild(item);
                })
 
                break;
 
            case 'rectangle':
            case 'circle':
                var tts = elem.returnDetails();
                var detailsElem = [];
 
                for (let i = 1; i < tts.length; i++) {
                    var div = create_elem_adj('div', 'detailsListItem', undefined, undefined);
                    var list = create_elem_adj('li', undefined, undefined, undefined);
 
                    if (i > tts[0]) {
                        var label = create_elem_adj('label', 'details-item-label', tts[i][1], undefined);
                        var inp = create_input_elem('number', tts[i][0]);
 
                        elem.addDetailListeners(inp);
 
                        inp.addEventListener("input", elem.changeAttributes);
                        inp.setAttribute("step", 0.1);
 
                        div.appendChild(label);
                        div.appendChild(inp);
                    } else {
                        for (let j = 0; j < 2; j++) {
                            var label = create_elem_adj('label', 'details-item-label', j == 0 ? 'Point x:' : 'Point Y:', undefined);
                            var inp = create_input_elem('number', tts[i][j]);
                            inp.setAttribute("step", 0.1);
                            elem.addDetailListeners(inp);
                            inp.addEventListener("input", elem.changeAttributes);
                            var lb = create_elem_adj('br', undefined, undefined, undefined);
 
                            div.appendChild(label);
                            div.appendChild(inp);
                            div.appendChild(lb);
                        }
                    }
 
                    list.appendChild(div);
                    detailsElem.push(list);
                }
 
                detailsElem.forEach((item) => {
                    detailsPanvasList.appendChild(item);
                })
                break;
 
        }*/
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
                        let finishButton = this.create_elem_adj('button', undefined, 'Finish', 'finishButton');
                        finishButton.innerHTML = "Finish";
                        this.detailsPanvasList.appendChild(finishButton);
                        finishButton.onclick = () => {

                            this.temporaryObj = [];
                            this.drawingPoints = [];

                            this.objOnCanvas.push(this.inDrawingConfObj);

                            document.getElementById('finishButton').remove();

                            this.create_details_panel_elems(this.inDrawingConfObj)

                            this.drawingInterval = undefined;
                            this.drawingButtonSelected = false;
                            this.inDrawingConfObj = undefined;
                            this.type = "none";

                        };
                        this.drawingInterval = 1;
                        break;

                    case 'rectangle':
                        this.inDrawingConfObj = new Rectangle(this.drawingPoints[0], this.standartStyle);
                        this.temporaryObj.push(this.inDrawingConfObj);

                        this.drawingInterval = setInterval(this.inRectangleConfiguration, 100);
                        this.drawingLoopStop = false;
                        break;

                    default:
                        console.log("Hello World");
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
                        console.log("Hello world2!");
                }
            }
        }
    };
}


class CncFrame extends Component {


    constructor() {
        super();
        this.canvProvider = new CanvasProvider();
    }

    printHelloStatement() {
        console.log("Hello World!");
    }

    componentDidMount() {
        this.canvProvider.init();
    }

    render() {

        return (
            <div>
                <div className="row">
                    <div className="col">
                        <div>
                            <label htmlFor="woodWidth"> Width of Wood:</label>
                            <input type="number" min="5" id="woodWidth" />
                        </div>
                    </div>
                    <div className="col">
                        <div>
                            <label htmlFor="woodHeight">Height of Wood:</label>
                            <input type="number" min="5" id="woodHeight" />
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
                        <div>
                            <label className="label-display" htmlFor="yLineInput">yRow-Lines</label>
                            <input type="number" min="1" max="100" id="yLineInput" />
                            <label className="label-header" htmlFor="showLineY">Show lines? </label>
                            <input type="checkbox" id="showLineY" />
                        </div>

                    </div>

                    <div className="row buttonGroup">
                        <div className="col">
                            <div className="btn-group">
                                <button type="button" className="btn btn-secondary">Mirroring vertical</button>
                                <button type="button" className="btn btn-secondary">Mirroring horizontal</button>
                                <button type="button" className="btn btn-secondary">choose outline</button>
                                <button type="button" className="btn btn-secondary">define cutout area</button>
                                <button type="button" className="btn btn-secondary">repeate pattern</button>
                            </div>
                        </div>
                    </div>

                    <div className="row buttonGroup">
                        <div className="col-2">
                        </div>
                        <div className="col-8">
                            <div className="btn-group">
                                <button type="button" className="btn btn-primary" onClick={this.canvProvider.selectCicrle.bind(this.canvProvider)}>Circle</button>
                                <button type="button" className="btn btn-primary" onClick={this.printHelloStatement}>Triangle</button>
                                <button type="button" className="btn btn-primary" onClick={this.canvProvider.selectRectangle}>Rectangle</button>
                                <button type="button" className="btn btn-primary" onClick={this.canvProvider.selectLine}>Line</button>
                            </div>
                        </div>
                        <div className="col-2">
                        </div>

                    </div>


                    <div className="row canvasRow">
                        <div className="col-4 detailRow">
                            <h3 className="details-header">Details:</h3>
                            <ul id="details-list">
                            </ul>
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

function calcAngleBVector(v1, v2) {
    let first = (v1[0] * v2[0] + v1[1] * v2[1])
    let second = calcVectorLength(v1) * calcVectorLength(v2);
    let quot;
    if (first === 0 || second === 0) {
        quot = 0;
    } else {
        quot = first / second;
    }

    return Math.acos(quot);
}

function createRotMatrix(a) {
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
    return Math.sqrt(Math.pow(v1[0], 2) + Math.pow(v1[1], 1));
}

function calculateDistance(x1, y1, x2, y2) {
    var xdif = Math.pow(x1 - x2, 2);
    var ydif = Math.pow(y1 - y2, 2);

    return Math.sqrt(xdif + ydif);
}

/* <li>
                                    <div class="detailsListItem">
                                        <label class="details-item-label">Point x</label>
                                        <input type="number">
                                            <br>
                                                <label class="details-item-label">Point x</label>
                                                <input type="number"/>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="detailsListItem">
                                                    <label class="details-item-label">Point Y</label>
                                                    <input type="number"/>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="detailsListItem">
                                                    <label class="details-item-label">Point Z</label>
                                                    <input type="number"/>
                                                </div>
                                            </li>*/

export default CncFrame; 