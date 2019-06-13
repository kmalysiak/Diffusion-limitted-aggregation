'use strict';

import * as engine from './engine';
import * as rand from './rand';
import {Point} from './commonClasses';

const defaultDrift = 0.5;
const defaultStickProbability = 1;

let canvas;
let context;
let canvasSize = new Point(0, 0);
let seed = new Point(0, 0);
let maxAggregateRadius;

let simulationParameters = {
    isParamsChanged: false,
    stickProbability: defaultStickProbability,
    verticalDrift: defaultDrift,
    horizontalDrift: defaultDrift
};

export {context, canvas, canvasSize, seed, simulationParameters, maxAggregateRadius, writeStatus};

document.addEventListener("DOMContentLoaded", init);

function init() {
    canvas = document.getElementById("canvas");
    canvasSize.x = canvas.width;
    canvasSize.y = canvas.height;
    seed.x = Math.floor(canvasSize.x / 2);
    seed.y = Math.floor(canvasSize.y / 2);
    context = canvas.getContext("2d");
    context.fillStyle = 'rgba(255, 0, 0, 255)';
    context.clearRect(0, 0, canvasSize.x, canvasSize.y);
    context.arc(canvasSize.x / 2, canvasSize.y / 2, 3, 0, 2 * Math.PI);
    context.fill();
    context.font = "15px Arial";
    writeStatus(context,"Status: Cleared. Hit start to begin new simulation.");
    maxAggregateRadius = Math.floor(Math.sqrt(canvasSize.x * canvasSize.x + canvasSize.y * canvasSize.y));
    rand.initRandNum();
    addHandlers();

}

function addHandlers() {
    document.getElementById("driftVertical").addEventListener("input", setDriftVertical);
    document.getElementById("driftVertical").addEventListener("dblclick", resetDriftVertical);

    document.getElementById("driftHorizontal").addEventListener("input", setDriftHorizontal);
    document.getElementById("driftHorizontal").addEventListener("dblclick", resetDriftHorizontal);

    document.getElementById("aggregationProbability").addEventListener("input", setAggregationProbability);

    document.getElementById("btn-start").addEventListener("click", engine.start);
    document.getElementById("btn-pause").addEventListener("click", engine.pause);
    document.getElementById("btn-clear").addEventListener("click", engine.stopAndClearCanvas);
}


function setAggregationProbability() {
    let slider = document.getElementById("aggregationProbability");
    let output = document.getElementById("aggregationProbabilityValue");
    output.innerHTML = slider.value;
    simulationParameters.stickProbability = slider.value;
    simulationParameters.isParamsChanged = true;
}

function setDriftHorizontal() {
    let slider = document.getElementById("driftHorizontal");
    let output = document.getElementById("driftHorizontalValue");
    output.innerHTML = slider.value;
    simulationParameters.horizontalDrift = slider.value;
    simulationParameters.isParamsChanged = true;
}

function setDriftVertical() {
    let slider = document.getElementById("driftVertical");
    let output = document.getElementById("driftVerticalValue");
    output.innerHTML = slider.value;
    simulationParameters.verticalDrift = slider.value;
    simulationParameters.isParamsChanged = true;
}

function resetDriftVertical() {
    let slider = document.getElementById("driftVertical");
    let output = document.getElementById("driftVerticalValue");
    output.innerHTML = defaultDrift;
    simulationParameters.verticalDrift = defaultDrift;
    simulationParameters.isParamsChanged = true;
    slider.value = defaultDrift;
}

function resetDriftHorizontal() {
    let slider = document.getElementById("driftHorizontal");
    let output = document.getElementById("driftHorizontalValue");
    output.innerHTML = defaultDrift;
    simulationParameters.verticalDrift = defaultDrift;
    simulationParameters.isParamsChanged = true;
    slider.value = defaultDrift;
}

function writeStatus(ctx, text){
    ctx.clearRect(0, 760, 400, 30);
    ctx.fillText(text, 10, 780);
}
