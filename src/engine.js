'use strict'

let counter = 0;
let maxRadius = 0;
let isStop = false;
let stickProbability = 1;
let verticalDrift = 0.5;
let horizontalDrift = 0.5;
let textFile = null;



export { start, pause, stopAndClearCanvas, setDriftVertical, resetDriftVertical, setDriftHorizontal, resetDriftHorizontal, setAggregationProbability };
import * as rand from './rand';
import * as utils from './utils';
import * as main from './main';
import * as fractalDim from './fractalDim';



function start() {
    utils.logger('Run now: start');
    isStop = false;
    draw();

}

function stopAndClearCanvas() {
    utils.logger('Run now: clearCanvas');
    isStop = true;

    main.context.clearRect(0, 0, main.canvas.width, main.canvas.height);
    main.context.fillStyle = 'rgba(255, 0, 0, 255)';
    main.context.arc(main.seedX, main.seedY, 3, 0, 2 * Math.PI);
    main.context.fill()
    counter = 0;
    maxRadius = 0;
    document.getElementById("pts").innerHTML = counter;
    document.getElementById("size").innerHTML = maxRadius;
    document.getElementById("fdim").innerHTML = "-";
    main.canvasData = main.context.getImageData(0, 0, main.canvasWidth, main.canvasHeight);
}

function pause() {
    utils.logger('Run now: pause');
    isStop = true;
}

function draw() {
    utils.logger('Run now: draw');
    var i = 1;
    for (i = 0; i < 50; i++) {

        var randCircularPosition = rand.getRandCircularPosition(maxRadius + 10, main.seedX, main.seedY);
        var xStart = randCircularPosition.posX;
        var yStart = randCircularPosition.posY;
        var newX = 0
        var newY = 0;
        var isNotAggregated = true;

        while (isNotAggregated) { //dopoki nie zagreguje

            if (maxRadius > 200)
                return;
            var jumps = rand.getRandJump(horizontalDrift, verticalDrift);
            newX = xStart + jumps.xJump;
            newY = yStart + jumps.yJump;
            //utils.logger('from draw:' + newX, newY, maxRadius + 12, isValid(newX, newY, maxRadius + 12));
            if (!isValid(newX, newY, maxRadius + 12)) { //jezeli chce wyskoczyć poza obszar to stoj w miejscu
                newX = xStart;
                newY = yStart;
            }
            else {

                if (isAggregate(newX, newY, main.canvasData)) { //jeżęli chce wskoczyć tam gdzie juz jest czastka
                    if (shouldStick()) { //jezeli ma sie przykleic
                        drawPixel(xStart, yStart, 255, 0, 0, 255, main.canvasData);
                        var tempmax = Math.floor(Math.sqrt((xStart - main.seedX) * (xStart - main.seedX) + (yStart - main.seedY) * (yStart - main.seedY)));
                        //utils.logger(newX, newY, maxRadius);
                        if (tempmax > maxRadius) {
                            maxRadius = tempmax;
                            //utils.logger(newX, newY, maxRadius);
                        }
                        counter++;
                        if (counter === 500)
                            diagnostic(main.canvasData);
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

        updateCanvas(main.context, main.canvasData);
        fractalDim.fractalDim(main.seedX, main.seedY, maxRadius, counter, main.canvasData);
        document.getElementById("pts").innerHTML = counter;
        document.getElementById("size").innerHTML = maxRadius;
        window.requestAnimationFrame(draw);
    }
}
function isValid(x, y, maxR) {
    //utils.logger('Run now: isvalid');
    var xx = x - main.seedX;
    var yy = y - main.seedY;
    var isValidd = ((xx * xx + yy * yy) <= maxR * maxR);
    //utils.logger('fromisvalid' +'x:' + xx + ' y:' + yy + ' maxR:' + maxR + ' isValid:'+  isValidd);
    return isValidd;
}

function isAggregate(x, y, canvasData) {
    //utils.logger('Run now: isAggregate');
    var index = (x + y * canvasWidth) * 4;
    return canvasData.data[index + 0] === 255;
}

function shouldStick() {
    //utils.logger('Run now: shouldStick');

    return (rand.myRand() < stickProbability);
}

function drawPixel(x, y, r, g, b, a, canvasData) {
    //utils.logger('Run now: drawPixel');

    var index = (x + y * main.canvasWidth) * 4;
    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
}

function updateCanvas(ctx, canvasData) {
    //utils.logger('Run now: updateCanvas');
    ctx.putImageData(canvasData, 0, 0);
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

