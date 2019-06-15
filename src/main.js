'use strict';

import * as engine from './engine';
import * as rand from './rand';
import * as canvasCommon from './canvasCommon'
import {Point} from './commonClasses';


const defaultDrift = 0.5;
const defaultStickProbability = 1;
const seedSize = 3;
const drawColor = 'rgba(255, 0, 0, 255)';

let canvas;
let context;
let canvasSize;
let seed;


let simulationParameters = {
    isParamsChanged: false,
    aggregationProbability: defaultStickProbability,
    driftVertical: defaultDrift,
    driftHorizontal: defaultDrift
};

export {context, canvas, canvasSize, seed, seedSize, simulationParameters, drawColor};

document.addEventListener("DOMContentLoaded", init);

function init() {
    canvas = document.getElementById("canvas");
    canvasSize = new Point(canvas.width, canvas.height);
    seed = new Point(Math.floor(Math.floor(canvasSize.x / 2)), Math.floor(canvasSize.y / 2));

    context = canvas.getContext("2d");
    context.fillStyle = drawColor;
    context.font = "15px Arial";
    canvasCommon.resetCanvas(context, canvas, seed, seedSize, seedSize);
    canvasCommon.writeStatus(context, "Status: Cleared. Hit start to begin new simulation.");

    rand.initRandNum();
    addHandlers();
}

function addHandlers() {

    let handlers = [];

    handlers.push({id: "driftVertical", type: "input", fun: setParameter});
    handlers.push({id: "driftVertical", type: "dblclick", fun: resetParameter});
    handlers.push({id: "driftHorizontal", type: "input", fun: setParameter});
    handlers.push({id: "driftHorizontal", type: "dblclick", fun: resetParameter});
    handlers.push({id: "aggregationProbability", type: "input", fun: setParameter});
    handlers.push({id: "btn-start", type: "click", fun: engine.start});
    handlers.push({id: "btn-pause", type: "click", fun: engine.pause});
    handlers.push({id: "btn-clear", type: "click", fun: engine.stopAndClearCanvas});

    handlers.forEach(function (handle) {
        document.getElementById(handle.id).addEventListener(handle.type, handle.fun);
    });
}

function setParameter() {
    simulationParameters[this.id] = doParameterChange(this.id, this.id + 'Value');
}

function resetParameter() {
    simulationParameters[this.id] = doParameterToDefault(this.id, this.id + 'Value');
}

function doParameterChange(sliderId, sliderOutputId) {
    let slider = document.getElementById(sliderId);
    let output = document.getElementById(sliderOutputId);
    output.innerHTML = slider.value;
    simulationParameters.isParamsChanged = true;
    return slider.value
}

function doParameterToDefault(sliderId, sliderOutputId) {
    let slider = document.getElementById(sliderId);
    let output = document.getElementById(sliderOutputId);
    output.innerHTML = defaultDrift;
    simulationParameters.isParamsChanged = true;
    slider.value = defaultDrift;
    return defaultDrift;
}


