'use strict'
let canvas;
let context;
let canvasWidth;
let canvasHeight;
let seedX;
let seedY;
const defaultDrift = 0.5;
const defaultStickProbability = 1;
let maxAggregateRadius;
let stickProbability = defaultStickProbability;
let verticalDrift = defaultDrift;
let horizontalDrift = defaultDrift;


import * as engine from './engine';
import * as utils from './utils';
import * as rand from './rand';
import {Point}  from './commonClasses';

export {context, canvas, canvasWidth, canvasHeight, seedX, seedY, horizontalDrift, verticalDrift, stickProbability, maxAggregateRadius};

document.addEventListener("DOMContentLoaded",init);

function init() {  
    utils.logger('Run now: init');
    canvas = document.getElementById("canvas");
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;


    seedX = Math.floor(canvasWidth / 2);
    seedY = Math.floor(canvasHeight / 2);

    context = canvas.getContext("2d");
    context.fillStyle = 'rgba(255, 0, 0, 255)';
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.arc(canvasWidth/2, canvasHeight/2, 3, 0, 2 * Math.PI);
    context.fill()
    maxAggregateRadius = Math.floor(Math.sqrt(canvasWidth*canvasWidth + canvasHeight*canvasHeight));
    rand.initRandNum();
    addHandlers();
    
}

function addHandlers(){
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
    output.innerHTML = defaultDrift;
    verticalDrift =defaultDrift;
    slider.value = defaultDrift;
}

function resetDriftHorizontal() {
    //utils.logger('Run now: resetDriftHorizontal');
    var slider = document.getElementById("driftHorizontal");
    var output = document.getElementById("driftHorizontalValue");
    output.innerHTML =defaultDrift;
    verticalDrift = defaultDrift;
    slider.value = defaultDrift;
}
