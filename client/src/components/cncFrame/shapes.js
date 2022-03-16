import {createRotMatrix, degreesToRad, radToDegree, calculateVector, calcVectorLength, calculateDistance, calcAngleBVector} from "./helperFunctions.js"; 

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

            ctx.beginPath();
            ctx.moveTo(this.points[i - 1][0], this.points[i - 1][1]);

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
                result.push(calcVectorLength(calculateVector(this.points[i - 1], this.points[0])).toFixed(2));
                break;
            }
            result.push(calcVectorLength(calculateVector(this.points[i], this.points[i + 1])).toFixed(2));
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

    changeLineValues(value, index) {
        this.cogP = [];
        let quot = value / this.lines[index];
        let newx = this.points[index][0] + quot * calculateVector(this.points[(index + 1) > 3 ? 0 : (index+1)], this.points[index])[0];
        let newy = this.points[index][1] + quot * calculateVector(this.points[(index + 1) > 3 ? 0 : (index+1)], this.points[index])[1];

        this.points[(index + 1) > 3 ? 0 : (index+1)] = [newx, newy];

        this.calculateMiddlePoint();
    }

    changePoints(value, index) {
        let diffrence = value - this.middlePoint[index];
        this.middlePoint[index] = value;
        this.points.map((item) => {
            return item[index] += diffrence;
        })

        this.cogP = [];
        this.calculateMiddlePoint();
    }

    finish() {
        this.middlePoint = this.calculateMiddlePoint();
        this.lines = this.calculateLineLength().map((item) => {
            return item.toFixed(2);
        });
        this.rotationAngle = this.calculateRotation().toFixed(2);
    }

    rotateCrucialPoint(value) {

        this.cogP = [];

        let difference = value - this.rotationAngle;
        let rot = createRotMatrix(difference);

        //create Point at (0 + x, 0 + y) to get the unit vector 
        let pointX = calculateVector(this.points[0], this.middlePoint)[0];
        let pointY = calculateVector(this.points[0], this.middlePoint)[1];

        let newX = pointX * rot[0][0] + pointY * rot[0][1];
        let newY = pointX * rot[1][0] + pointY * rot[1][1];

        let unitVector = calculateVector([newX, newY], this.points[0]);

        this.points.map((item, ind) => {
            if (ind === 0) {
                return [newX, newY];
            } else {
                return [item[0] + unitVector[0], item[1] + unitVector[1]];
            }
        })

        this.calculateMiddlePoint();

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
        //let s2 = calculateVector(t[1], t[2]);
        //let s3 = calculateVector(t[2], t[0]);


        let mid1 = [t[1][0] + s1[0] / 2, t[1][1] + s1[1] / 2];
        //let mid2 = [t[2][0] + s2[0] / 2, t[2][1] + s2[1] / 2];
        //let mid3 = [t[0][0] + s3[0] / 2, t[0][1] + s3[1] / 2];


        let d1 = calculateVector(t[2], mid1);
        //let d2 = calculateVector(t[0], mid2);
        //let d3 = calculateVector(t[1], mid3);


        let p1 = [(mid1[0] + d1[0] / 3), (mid1[1] + d1[1] / 3)];
        //let p2 = [(mid2[0] + d2[0] / 3), (mid2[1] + d2[1] / 3)];
        //let p3 = [(mid3[0] + d3[0] / 3), (mid3[1] + d3[1] / 3)];

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

export {Shape, Line, Circle, Grid, Rectangle, Point}; 