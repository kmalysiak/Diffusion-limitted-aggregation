'use strict'

var ctx;
var canvas;
var context;
var canvasWidth;
var canvasHeight;
//var canvasCenter;
var canvasData;
var counter = 0;
var maxRadius = 0;
var isStop = false;
var stickProbability = 1;
var verticalDrift = 0.5;
var horizontalDrift = 0.5;
var textFile = null;



//export {init, start, pause, clearCanvas, setDriftVertical, resetDriftVertical, setDriftHorizontal, resetDriftHorizontal, setAggregationProbability};
import * as rand from './rand';
import * as utils from './utils';


window.init = function() {
    
    //utils.logger('Run now: init');
    canvas = document.getElementById("canvas");
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    // canvasCenter = {
    //     x: canvasHeight / 2,
    //     y: canvasWidth / 2
    // }

    context = canvas.getContext("2d");
    ctx = context;
    context.fillStyle = 'rgba(255, 0, 0, 255)';
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.arc(400, 400, 3, 0, 2 * Math.PI);
    context.fill()
    canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    rand.initRandNum();
}

window.start = function() {
    //utils.logger('Run now: start');
    //utils.logger('clicked');
    isStop = false;    
    draw();
    
}

function clearCanvas() {
    //utils.logger('Run now: clearCanvas');
    //utils.logger('clicked');
    isStop = true;
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(255, 0, 0, 255)';
    context.arc(400, 400, 3, 0, 2 * Math.PI);
    context.fill()
    counter = 0;
    maxRadius = 0;
    document.getElementById("pts").innerHTML = counter;
    document.getElementById("size").innerHTML = maxRadius;
    document.getElementById("fdim").innerHTML = "-";
    canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
}

function pause() {
    //utils.logger('Run now: pause');
    isStop = true;
}

function draw() {
    //utils.logger('Run now: draw');
    var i =1;
    for (i = 0; i < 50; i++) {
        var angle = getRandRadian();
        var xStart = getCircularPositionX(angle, maxRadius + 10);
        var yStart = getCircularPositionY(angle, maxRadius + 10);
        var newX = 0
        var newY = 0;
        var isNotAggregated = true;

        while (isNotAggregated) { //dopoki nie zagreguje

            if(maxRadius > 200)
                return;
            var jumps = getRandJump();
            newX = xStart + jumps.xJump;
            newY = yStart + jumps.yJump;
            //utils.logger('from draw:' + newX, newY, maxRadius + 12, isValid(newX, newY, maxRadius + 12));
            if (!isValid(newX, newY, maxRadius + 12)) { //jezeli chce wyskoczyć poza obszar to stoj w miejscu
                newX = xStart;
                newY = yStart;
            }
            else {

                if (isAggregate(newX, newY, canvasData)) { //jeżęli chce wskoczyć tam gdzie juz jest czastka
                    if (shouldStick()) { //jezeli ma sie przykleic
                        drawPixel(xStart, yStart, 255, 0, 0, 255, canvasData);
                        var tempmax = Math.floor(Math.sqrt((xStart - 400) * (xStart - 400) + (yStart - 400) * (yStart - 400)));
                        //utils.logger(newX, newY, maxRadius);
                        if (tempmax > maxRadius) {
                            maxRadius = tempmax;
                            //utils.logger(newX, newY, maxRadius);
                        }
                        counter++;
                        if (counter === 500)
                            diagnostic(canvasData);
                        isNotAggregated = false;
                    }
                    else  //chce skoczyc na agregat ale nei chce sie przykleic to stoj w miejscu
                    {
                        newX = xStart;
                        newY = yStart;
                    }
                }

                else { //nie ma agrgatu i nie chce wyskoczyć poza obszar
                    xStart = newX;
                    yStart = newY;
                }
            }
        }
    }
    if (!isStop) {
        //utils.logger('Updatig canvas!')
        
        updateCanvas(ctx, canvasData);
        fractalDim(400, 400, maxRadius, counter, canvasData);
        document.getElementById("pts").innerHTML = counter;
        document.getElementById("size").innerHTML = maxRadius;
        window.requestAnimationFrame(draw);
    }
}
function isValid(x, y, maxR) {
    //utils.logger('Run now: isvalid');
    var xx = x - 400;
    var yy = y - 400;
    var isValidd = ((xx * xx + yy * yy) <= maxR * maxR);
    //utils.logger('fromisvalid' +'x:' + xx + ' y:' + yy + ' maxR:' + maxR + ' isValid:'+  isValidd);
    return isValidd;
}

function getRandPos() {
    //utils.logger('Run now: getRandPos');
    return Math.floor((rand.myRand() * 300));
}

function getRandRadian() {
    //utils.logger('Run now: getRandRadian');
    getRandPos
    return ((rand.myRand() * Math.PI * 2.0));
}

function getCircularPositionX(angle, radius) {
    //utils.logger('Run now: getCircularPositionX');
    return Math.floor(radius * Math.cos(angle)) + 400;
}

function getCircularPositionY(angle, radius) {
    //utils.logger('Run now: getCircularPositionY');
    return Math.floor(radius * Math.sin(angle)) + 400;
}

function getHorizontalRandJump() {
    utils.logger('Run now: getHorizontalRandJump');

    var prob = rand.myRand();
    //utils.logger('HORIZONTAl: prob:' + prob + ' horDrift:' + horizontalDrift);
    if (prob > horizontalDrift) return 1;
    else
        return -1;
}

function getVerticalRandJump() {
    //utils.logger('Run now: getVerticalRandJump');
    var prob = rand.myRand();
    //utils.logger('Vertical: prob:' + prob + ' verDrift:' + verticalDrift);
    if (prob > verticalDrift) return 1;
    else
        return -1;
}

function getRandJump() {
    //utils.logger('Run now: getRandJump');
    var xJump = 0;
    var yJump = 0;

    if (rand.myRand() < 0.5) {
        xJump = getHorizontalRandJump();
    }
    else {
        yJump = getVerticalRandJump();
    }

    var jumps = {
        xJump: xJump,
        yJump: yJump
    };

    return jumps;
}

function isAggregate(x, y, canvasData) {
    //utils.logger('Run now: isAggregate');
    var index = (x + y * canvasWidth) * 4;
    return canvasData.data[index + 0] === 255;
}

function shouldStick() {
    //utils.logger('Run now: shouldStick');
    var raaad = rand.myRand();
    return (raaad < stickProbability);
}

function drawPixel(x, y, r, g, b, a, canvasData) {
    //utils.logger('Run now: drawPixel');

    var index = (x + y * canvasWidth) * 4;
    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
}

function updateCanvas(ctx, canvasData) {
    //utils.logger('Run now: updateCanvas');
    ctx.putImageData(canvasData, 0, 0);
}

var fractalDim = function (seedx, seedy, maxR, mass, canvasData) {
    //utils.logger('Run now: fractalDim');
    if (maxR < 15)
        return 0;
    //utils.logger(maxR);
    var minR = 5
    maxR = Math.floor(maxR / 2);

    var aggregateSize = [];
    var aggregateMass = [];
    for (var rad = minR; rad <= maxR; rad++) {

        var ilecz = 0;

        for (var i = seedx - rad; i <= seedx + rad; i++)
            for (var j = seedy - rad; j <= seedy + rad; j++) {
                var squaredDistFromCenter = (i - seedx) * (i - seedx) + (j - seedy) * (j - seedy);
                if (squaredDistFromCenter <= (rad * rad) && isAggregate(i, j, canvasData))
                    ilecz++;
            }

        aggregateSize.push(Math.log10(rad));
        aggregateMass.push(Math.log10(ilecz));
    }

    var ans = linearRegression(aggregateMass, aggregateSize);
    document.getElementById("fdim").innerHTML = Math.round(ans.slope * 1000) / 1000;
    //utils.logger(ans.slope, ans.r2);

}


var linearRegression = function (y, x) {
    //utils.logger('Run now: linearRegression');
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < y.length; i++) {

        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i] * y[i]);
        sum_xx += (x[i] * x[i]);
        sum_yy += (y[i] * y[i]);
    }

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
    lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

    return lr
}

function setAggregationProbability() {
    //utils.logger('Run now: setAggregationProbability');
    var slider = document.getElementById("aggregationProbability");
    var output = document.getElementById("aggregationProbabilityValue");
    output.innerHTML = slider.value;
    stickProbability = slider.value;
}

function setDriftHorizontal() {
    //utils.logger('Run now: setDriftHorizontal');
    var slider = document.getElementById("driftHorizontal");
    var output = document.getElementById("driftHorizontalValue");
    output.innerHTML = slider.value;
    horizontalDrift = slider.value;
}

function setDriftVertical() {
    //utils.logger('Run now: setDriftVertical');
    var slider = document.getElementById("driftVertical");
    var output = document.getElementById("driftVerticalValue");
    output.innerHTML = slider.value;
    verticalDrift = slider.value;
}

function resetDriftVertical() {
    //utils.logger('Run now: resetDriftVertical');
    var slider = document.getElementById("driftVertical");
    var output = document.getElementById("driftVerticalValue");
    output.innerHTML = 0.5;
    verticalDrift = 0.5;
    slider.value = 0.5;
}

function resetDriftHorizontal() {
    //utils.logger('Run now: resetDriftHorizontal');
    var slider = document.getElementById("driftHorizontal");
    var output = document.getElementById("driftHorizontalValue");
    output.innerHTML = 0.5;
    verticalDrift = 0.5;
    slider.value = 0.5;
}


function diagnostic(canvasData) {
    //utils.logger('Run now: diagnostic');
    var content = "";
    for (var i = 0; i < 800; i++) {
        var line = [];
        for (var j = 0; j < 800; j++) {
            if (isAggregate(i, j, canvasData))
                line.push(1);
            else
                line.push(0);
        }

        content += line.join(",");
        content += "\n"
    }

    var data = new Blob([content], { type: 'text/plain' });
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);
    var link = document.getElementById('downloadlink');
    link.href = textFile;
    link.style.display = 'block';

};



// function shiftEngineGen() {
//     var maxint = 2147483647;
//     var raw = myRand() * maxint;
//     return function getRandBool() {
//         if (raw === 0) {
//             raw = myRand() * maxint;
//         }
//         raw = raw >> 1;
//         return raw & 1;
//     }
// }

