'use strict';

import * as main from "./main";
import * as canvasCommon from './canvasCommon'
import Worker from 'worker-loader!./core.js'

export {start, pause, stopAndClearCanvas};


let isStop = false;
let cdt;
let coreWorker;
let status;

let isInit = false;
coreWorker = new Worker();

coreWorker.onmessage = function (e) {
    if (isStop) return;
    let partList = JSON.parse(e.data.part);
    for (let i = 0; i < partList.length; i++) {
        drawPixel(partList[i], cdt, main.canvasSize)

    }
    updateCanvas(main.context, cdt);

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

        coreWorker.postMessage(['init', {seed: main.seed, canvasSize: main.canvasSize}]);
        coreWorker.postMessage(['paramsUpdate', main.simulationParameters]);

        if (main.simulationParameters.isParamsChanged) {
            coreWorker.postMessage(['paramsUpdate', main.simulationParameters]);
            main.simulationParameters.isParamsChanged = false;
        }
        isInit = true;
    }
    isStop = false;

    coreWorker.postMessage('start');
    status = canvasCommon.messages.onStart;
}

function stopAndClearCanvas() {
    coreWorker.postMessage('stop');
    isStop = true;
    canvasCommon.resetCanvas(main.context, main.canvas, main.seed, main.seedSize);
    status = canvasCommon.messages.onClear;
    canvasCommon.writeStatus(main.context, status);

    document.getElementById("pts").innerHTML = '0';
    document.getElementById("size").innerHTML = '0';
    document.getElementById("fdim").innerHTML = "-";
    cdt = main.context.getImageData(0, 0, main.canvasSize.x, main.canvasSize.y);

}

function pause() {
    coreWorker.postMessage('pause');
    isStop = true;
    status = canvasCommon.messages.onPause;
    canvasCommon.writeStatus(main.context, status);
}

function drawPixel(point, canvasData, canvasSize) {
    let index = (point.x + point.y * canvasSize.x) * 4;
    canvasData.data[index + 0] = 255;
    canvasData.data[index + 3] = 255;
}

function updateCanvas(ctx, canvasData) {
    ctx.putImageData(canvasData, 0, 0);
    canvasCommon.writeStatus(ctx, status);
}


