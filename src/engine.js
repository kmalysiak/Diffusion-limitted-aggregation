'use strict'

export { start, pause, stopAndClearCanvas };
//import * as rand from './rand';
import * as main from './main';
import * as fractalDim from './fractalDim';
import Worker from 'worker-loader!./core.js'

const seedSize = 2;
let totalAggregatedCount = 0;
let currentMaxRadius = 0;

let isStop = false;
let cdt;
let aggregatedPointRadiuses = [];
let coreWorker;

let isInit = false;

let isStarted = false;
coreWorker = new Worker();

coreWorker.onmessage = function (e) {
    // console.log(e.data.aggregatedPointRadiuses);
    //console.log(e.data.aggregatedParticlesList);
    let partList = JSON.parse(e.data.part);
    for (let i = 0; i < partList.length; i++) {
        drawPixel(partList[i], 255, 0, 0, 255, cdt, main.canvasSize)

    }
    updateCanvas(main.context, cdt);
   // console.log(e.data.aggregatedParticlesCount);
    document.getElementById("pts").innerHTML = e.data.aggregatedParticlesCount;
    document.getElementById("size").innerHTML = e.data.currentMaxRadius;
    document.getElementById("fdim").innerHTML = Math.round(e.data.fd * 1000) / 1000;
    if(!isStop) {
        //setTimeout(coreWorker.postMessage('continue'), 0);
        if(main.simulationParameters.isParamsChanged) {
            coreWorker.postMessage(['paramsUpdate', main.simulationParameters]);
            main.simulationParameters.isParamsChanged = false;
        }
        coreWorker.postMessage('continue');
    }
}
function start() {
    if (!isInit) {
        cdt = main.context.getImageData(0, 0, main.canvasSize.x, main.canvasSize.y);
        coreWorker.postMessage('init');
        if(main.simulationParameters.isParamsChanged) {
            coreWorker.postMessage(['paramsUpdate', main.simulationParameters]);
            main.simulationParameters.isParamsChanged = false;
        }
        isInit = true;
    }
    isStop = false;

    coreWorker.postMessage('start');
}

function stopAndClearCanvas() {
    coreWorker.postMessage('stop');
    isStop = true;
    // isStop = true;
    // main.context.clearRect(0, 0, main.canvas.width, main.canvas.height);
    // main.context.fillStyle = 'rgba(255, 0, 0, 255)';
    // main.context.arc(main.seed.x, main.seed.y, seedSize, 0, 2 * Math.PI);
    // main.context.fill()
    // totalAggregatedCount = 0;
    // currentMaxRadius = 0;
    // document.getElementById("pts").innerHTML = totalAggregatedCount;
    // document.getElementById("size").innerHTML = currentMaxRadius;
    // document.getElementById("fdim").innerHTML = "-";
    // cdt = main.context.getImageData(0, 0, main.canvasSize.xh, main.canvasSize.y);
}

function pause() {
    coreWorker.postMessage('pause');
    isStop = true;
}

function draw() {

    //tutaj uruchamiam watek w core; przekazuje parametry symulacji
    // //
    // if (!isStop) {
    //     updateCanvas(main.context, cdt);
    //     fractalDim.fractalDim2(aggregatedPointRadiuses, currentMaxRadius, main.canvasSize);

    //     window.requestAnimationFrame(draw);
    // }

}



// function isJumpWithinDomain(newPosition, maxR, seed) {
//     return (newPosition.distanceSquare(seed) <= maxR * maxR);
// }

// function isAggregate(position, canvasData, canvasSize) {
//     let index = (position.x + position.y * canvasSize.x) * 4;
//     return canvasData.data[index] === 255;
// }

// function isGetAggregated() {
//     return (rand.getRandUniformBool() < main.stickProbability);
// }

function drawPixel(point, r, g, b, a, canvasData, canvasSize) {
    let index = (point.x + point.y * canvasSize.x) * 4;
    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
}

function updateCanvas(ctx, canvasData) {
    ctx.putImageData(canvasData, 0, 0);
}

