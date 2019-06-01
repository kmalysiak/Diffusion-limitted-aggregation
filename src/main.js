'use strict'

const defaultDrift = 0.5;
const defaultStickProbability = 1;

let canvas;
let context;
let canvasSize = new Point(0,0);
let seed = new Point(0,0);
let maxAggregateRadius;
let stickProbability = defaultStickProbability;
let verticalDrift = defaultDrift;
let horizontalDrift = defaultDrift;


import * as engine from './engine';
import * as rand from './rand';
import {Point}  from './commonClasses';

export {context, canvas, canvasSize, seed, horizontalDrift, verticalDrift, stickProbability, maxAggregateRadius};

document.addEventListener("DOMContentLoaded",init);

function init() {  
    canvas = document.getElementById("canvas"); 
    canvasSize.x = canvas.width;
    canvasSize.y = canvas.height;
    seed.x = Math.floor(canvasSize.x / 2);
    seed.y = Math.floor(canvasSize.y / 2);
    context = canvas.getContext("2d");
    context.fillStyle = 'rgba(255, 0, 0, 255)';
    context.clearRect(0, 0, canvasSize.x, canvasSize.y);
    context.arc(canvasSize.x/2, canvasSize.y/2, 3, 0, 2 * Math.PI);
    context.fill()
    maxAggregateRadius = Math.floor(Math.sqrt(canvasSize.x*canvasSize.x + canvasSize.y*canvasSize.y));
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
    var slider = document.getElementById("aggregationProbability");
    var output = document.getElementById("aggregationProbabilityValue");
    output.innerHTML = slider.value;
    stickProbability = slider.value;
}

function setDriftHorizontal() {
    var slider = document.getElementById("driftHorizontal");
    var output = document.getElementById("driftHorizontalValue");
    output.innerHTML = slider.value;
    horizontalDrift = slider.value;
}

function setDriftVertical() {
    var slider = document.getElementById("driftVertical");
    var output = document.getElementById("driftVerticalValue");
    output.innerHTML = slider.value;
    verticalDrift = slider.value;
}

function resetDriftVertical() {
    var slider = document.getElementById("driftVertical");
    var output = document.getElementById("driftVerticalValue");
    output.innerHTML = defaultDrift;
    verticalDrift =defaultDrift;
    slider.value = defaultDrift;
}

function resetDriftHorizontal() {
    var slider = document.getElementById("driftHorizontal");
    var output = document.getElementById("driftHorizontalValue");
    output.innerHTML =defaultDrift;
    verticalDrift = defaultDrift;
    slider.value = defaultDrift;
}
