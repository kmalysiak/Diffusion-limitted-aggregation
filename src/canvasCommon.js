'use strict';

export {writeStatus, resetCanvas}

function writeStatus(ctx, text) {
    ctx.clearRect(0, 760, 400, 30);
    ctx.fillText(text, 10, 780);
}

function resetCanvas(context, canvas, seed, seedSize) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(255, 0, 0, 255)';
    context.arc(seed.x, seed.y, seedSize, 0, 2 * Math.PI);
    context.fill();
}