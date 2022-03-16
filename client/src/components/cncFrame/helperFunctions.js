
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

export {createRotMatrix, degreesToRad, radToDegree, calculateVector, calcVectorLength, calculateDistance, calcAngleBVector}; 