'use strict';

export {writeStatus, resetCanvas, messages}
import {canvasSize, fillStyle} from './main'

function writeStatus(ctx, text) {
    ctx.clearRect(0, canvasSize.y - 40, 400, 30);
    ctx.fillText(text, 10, canvasSize.y - 20);
}

function resetCanvas(context, canvas, seed, seedSize) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = fillStyle;
    context.arc(seed.x, seed.y, seedSize, 0, 2 * Math.PI);
    context.fill();
}

let messages = {
    onClear: "Status: Cleared. Hit start to begin new simulation.",
    onStart: "Status: Started. Simulation on the run.",
    onPause: "Status: Paused. Hit start to continue simulation."
};