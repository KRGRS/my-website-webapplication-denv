import React, { Component } from 'react';
import Canvas from './canvas';

//classes 
class Shape {
    constructor(p, sty) {
        this.points = [];
        /*if (Array.isArray(p)) {
            p.forEach((item) => {
                this.points.push(item);
            })
        } else {
            this.points.push(p);
        }*/

        this.points.push(p);

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

        ctx.stroke();

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
        this.finished = false;
        this.lines = [];
    }

    calculateLines() {
        let result = [];
        for (let i = 0; i < this.points.length; i++) {
            if (i === this.points.length - 1) {
                result.push(calcVectorLength(calculateVector(this.points[i - 1], this.points[0])));
                break;
            }
            result.push(calcVectorLength(calculateVector(this.points[i], this.points[i + 1])));
        }

        return result;
    }

    finishLine() {
        this.finished = true;
        this.lines = this.calculateLines()
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
            /*this.xTranslation = parseInt(this.detailPanelInputs[0].value);
            this.yTranslation = parseInt(this.detailPanelInputs[1].value);
            this.rotationAngle = parseInt(this.detailPanelInputs[2].value);
            this.countOfPoints = parseInt(this.detailPanelInputs[3].value);
            this.radius = parseInt(this.detailPanelInputs[4].value);*/

            this.changeRadiusOfCircle();
            this.rotateCrucialPoint();
            this.configurePoints();

            if (this.points[0] === this.points[1]) {
                this.points = [this.points[0]];
                this.configurePoints();
            }
        };
    }

    /**
     * function is out of use
     */
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
        let quot = this.radius / calcVectorLength(vectorRP);

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

        this.points = [];

        for (let i = angle; i <= 360; i += angle) {

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
        this.middlePoint = [];
        this.rotationAngle = 0;
        this.lines = undefined;
        this.cogP = [];
    }

    draw(ctx) {
        ctx.fillStyle = this.style;

        ctx.beginPath();
        ctx.arc(this.middlePoint[0], this.middlePoint[1], 2, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.moveTo(this.points[0][0], this.points[0][1]);
        ctx.arc(this.points[0][0], this.points[0][1], 2, 0, 2 * Math.PI);
        ctx.fillText('0', this.points[0][0], this.points[0][1]);


        for (let i = 1; i < this.points.length; i++) {
            let point2 = this.points[i];

            ctx.arc(point2[0], point2[1], 2, 0, 2 * Math.PI);

            ctx.lineTo(point2[0], point2[1]);

            ctx.fillText(i, point2[0], point2[1]);
        }

        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = 'rgba(0, 255, 0, 1)';
        this.cogP.forEach((item, ind) => {
            ctx.beginPath();
            ctx.arc(item[0], item[1], 1, 0, 2 * Math.PI);
            ctx.fillText("S" + (ind + 1), item[0], item[1]);
            ctx.stroke();
        })
    }

    finish() {
        this.middlePoint = this.calculateMiddlePoint();
        this.lines = this.calculateLineLength();
        this.rotationAngle = this.calculateRotation();
    }

    calculateRotation() {
        let hp = this.middlePoint;
        hp[0] += this.lines[0] / 2;

        let v1 = calculateVector(hp, this.middlePoint);
        let v2 = calculateVector(this.points[0], this.middlePoint);

        let rot = calcAngleBVector(v1, v2);

        return isNaN(rot) ? 0 : rot;
    }

    calculateLineLength() {
        let lines = [];

        lines.push(calcVectorLength(calculateVector(this.points[0], this.points[1])));
        lines.push(calcVectorLength(calculateVector(this.points[1], this.points[2])));
        lines.push(calcVectorLength(calculateVector(this.points[2], this.points[3])));
        lines.push(calcVectorLength(calculateVector(this.points[3], this.points[0])));

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

    print(arg) {
        arg.forEach((item) => {
            console.log(item);
        })

        console.log("'''");
    }

    calculateCentroidOfTriangle(t) {

        let s1 = calculateVector(t[0], t[1]);
        let s2 = calculateVector(t[1], t[2]);
        let s3 = calculateVector(t[2], t[0]);


        let mid1 = [t[1][0] + s1[0] / 2, t[1][1] + s1[1] / 2];
        let mid2 = [t[2][0] + s2[0] / 2, t[2][1] + s2[1] / 2];
        let mid3 = [t[0][0] + s3[0] / 2, t[0][1] + s3[1] / 2];


        let d1 = calculateVector(t[2], mid1);
        let d2 = calculateVector(t[0], mid2);
        let d3 = calculateVector(t[1], mid3);


        let p1 = [(mid1[0] + d1[0] / 3), (mid1[1] + d1[1] / 3)];
        let p2 = [(mid2[0] + d2[0] / 3), (mid2[1] + d2[1] / 3)];
        let p3 = [(mid3[0] + d3[0] / 3), (mid3[1] + d3[1] / 3)];

        return p1;
    }

    calculateMiddlePoint() {
        //diagonal from p0 to p2 
        let triangle1 = [this.points[0], this.points[1], this.points[2]];
        let triangle2 = [this.points[0], this.points[2], this.points[3]];

        //diagonal from p1 to p3 
        let triangle3 = [this.points[0], this.points[1], this.points[3]];
        let triangle4 = [this.points[1], this.points[2], this.points[3]];

        //calculate cog for first two triangles
        let s1 = this.calculateCentroidOfTriangle(triangle1);
        let s2 = this.calculateCentroidOfTriangle(triangle2);

        this.cogP.push(s1, s2);

        //calculate cog for second two triangles
        let s3 = this.calculateCentroidOfTriangle(triangle3);
        let s4 = this.calculateCentroidOfTriangle(triangle4);

        this.cogP.push(s3, s4);

        let midP = this.checkLineIntersection(s1[0], s1[1], s2[0], s2[1], s3[0], s3[1], s4[0], s4[1]);

        let middlePoint = [midP.x, midP.y];

        return middlePoint;
    }

    /**
     * 
     * @param {*} line1StartX 
     * @param {*} line1StartY 
     * @param {*} line1EndX 
     * @param {*} line1EndY 
     * @param {*} line2StartX 
     * @param {*} line2StartY 
     * @param {*} line2EndX 
     * @param {*} line2EndY 
     * @returns Object with values of x and y and the booleans onLine1 and onLine2
     */

    checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
        // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
        var denominator, a, b, numerator1, numerator2, result = {
            x: null,
            y: null,
            onLine1: false,
            onLine2: false
        };
        denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
        if (denominator === 0) {
            return result;
        }
        a = line1StartY - line2StartY;
        b = line1StartX - line2StartX;
        numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
        numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
        a = numerator1 / denominator;
        b = numerator2 / denominator;

        // if we cast these lines infinitely in both directions, they intersect here:
        result.x = line1StartX + (a * (line1EndX - line1StartX));
        result.y = line1StartY + (a * (line1EndY - line1StartY));
        /*
                // it is worth noting that this should be the same as:
                x = line2StartX + (b * (line2EndX - line2StartX));
                y = line2StartX + (b * (line2EndY - line2StartY));
                */
        // if line1 is a segment and line2 is infinite, they intersect if:
        if (a > 0 && a < 1) {
            result.onLine1 = true;
        }
        // if line2 is a segment and line1 is infinite, they intersect if:
        if (b > 0 && b < 1) {
            result.onLine2 = true;
        }
        // if line1 and line2 are segments, they intersect if both of the above are true
        return result;
    };


}


class CanvasProvider {

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

                clearInterval(this.drawingInterval);
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

                this.inDrawingConfObj = undefined;
                this.inDrawingConfiguration = false;
                this.countOfPoints = 0;
                this.temporaryObj = [];
                this.drawingPoints = [];

                clearInterval(this.drawingInterval)
            }
        }
    }

    setAttributes(el, attrs) {
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
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

    changeAttributesOfLine() {

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
                            <input type="number" defaultValue={elem.countOfPoints}></input>
                        </div>

                        <div className="details-list-item">
                            <label className="details-item-label-top">Rotation Angle: </label>
                            <br></br>
                            <label className="details-item-label"> Angle in degrees: </label>
                            <input type="number" defaultValue={elem.rotationAngle}></input>
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
                                <input type="number" defaultValue={elem.middlePoint[0]}></input>
                                <br></br>
                                <label className="details-item-label"> Point Y: </label>
                                <input type="number" defaultValue={elem.middlePoint[1]}></input>
                            </div>


                            {elem.points.map((item, ind) => {
                                return (
                                    <div className="details-list-item" key={ind}>
                                        <label className="details-item-label-top">Point {ind}:</label>
                                        <br></br>
                                        <label className="details-item-label"> Point X: </label>
                                        <input type="number" defaultValue={item[0]}></input>
                                        <br></br>
                                        <label className="details-item-label"> Point Y: </label>
                                        <input type="number" defaultValue={item[1]}></input>
                                    </div>
                                );
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
                            <div className="details-list-item">
                                <label className="details-item-label-top"> Rotation (in degrees): </label>
                                <input type="number" defaultValue={elem.rotationAngle}></input>
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


class CncFrame extends Component {

    constructor() {
        super();
        this.canvProvider = new CanvasProvider(this);
        this.fullScreenState = false;
        this.changeFullScreenState = () => {
            this.fullScreenState ? this.fullScreenState = false : this.fullScreenState = true;
            this.forceUpdate();
        }
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
                            <input type="number" min="5" id="woodWidth" className='wood-column' step='10'/>
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
                                {this.canvProvider.detailsPanvasListReact}
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
    return Math.sqrt(Math.pow(v1[0], 2) + Math.pow(v1[1], 2));
}

function calculateDistance(x1, y1, x2, y2) {
    var xdif = Math.pow(x1 - x2, 2);
    var ydif = Math.pow(y1 - y2, 2);

    return Math.sqrt(xdif + ydif);
}

export default CncFrame; 