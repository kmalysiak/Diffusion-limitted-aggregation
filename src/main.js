'use strict'
let canvas;
let canvasData
let context;
let canvasWidth;
let canvasHeight;
let seedX;
let seedY;



import * as engine from './engine';
import * as utils from './utils';
import * as rand from './rand';

export {context, canvas, canvasWidth, canvasHeight, canvasData, seedX, seedY};

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
    canvasData = context.getImageData(0, 0, canvasWidth, canvasHeight);
    rand.initRandNum();

    addHandlers();
    
}

function addHandlers(){
    document.getElementById("driftVertical").addEventListener("input", engine.setDriftVertical);
    document.getElementById("driftVertical").addEventListener("ondblclick", engine.resetDriftVertical);

    document.getElementById("driftHorizontal").addEventListener("input", engine.setDriftHorizontal);
    document.getElementById("driftHorizontal").addEventListener("dblclick", engine.resetDriftHorizontal);

    document.getElementById("aggregationProbability").addEventListener("input", engine.setAggregationProbability);

    document.getElementById("btn-start").addEventListener("click", engine.start);
    document.getElementById("btn-pause").addEventListener("click", engine.pause);
    document.getElementById("btn-clear").addEventListener("click", engine.stopAndClearCanvas);
}