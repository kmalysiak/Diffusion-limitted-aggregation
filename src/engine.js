'use strict';

export {start, pause, stopAndClearCanvas};
import * as main from './main';
import Worker from 'worker-loader!./core.js'

const seedSize = 2;


let isStop = false;
let cdt;
let coreWorker;

let isInit = false;
coreWorker = new Worker();

coreWorker.onmessage = function (e) {
    if (isStop) return;
    let partList = JSON.parse(e.data.part);
    for (let i = 0; i < partList.length; i++) {
        drawPixel(partList[i], 255, 0, 0, 255, cdt, main.canvasSize)

    }
    updateCanvas(main.context, cdt);
    // console.log(e.data.aggregatedParticlesCount);
    document.getElementById("pts").innerHTML = e.data.aggregatedParticlesCount;
    document.getElementById("size").innerHTML = e.data.currentMaxRadius;
    if (e.data.fd !== undefined)
        document.getElementById("fdim").innerHTML = (Math.round(e.data.fd * 1000) / 1000).toString();
    if (!isStop) {
        if (main.simulationParameters.isParamsChanged) {
            coreWorker.postMessage(['paramsUpdate', main.simulationParameters]);
            main.simulationParameters.isParamsChanged = false;
        }
        coreWorker.postMessage('continue');
    }
};

function start() {
    if (!isInit) {
        cdt = main.context.getImageData(0, 0, main.canvasSize.x, main.canvasSize.y);
        coreWorker.postMessage('init');
        if (main.simulationParameters.isParamsChanged) {
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
    main.context.clearRect(0, 0, main.canvas.width, main.canvas.height);
    main.context.fillStyle = 'rgba(255, 0, 0, 255)';
    main.context.arc(main.seed.x, main.seed.y, seedSize, 0, 2 * Math.PI);
    main.context.fill();
    document.getElementById("pts").innerHTML = '0';
    document.getElementById("size").innerHTML = '0';
    document.getElementById("fdim").innerHTML = "-";
    cdt = main.context.getImageData(0, 0, main.canvasSize.x, main.canvasSize.y);
}

function pause() {
    coreWorker.postMessage('pause');
    isStop = true;
}

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

