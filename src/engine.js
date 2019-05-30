'use strict'

export { start, pause, stopAndClearCanvas };
import * as rand from './rand';
import * as utils from './utils';
import * as main from './main';
import * as fractalDim from './fractalDim';
import { Point } from './commonClasses';

const seedSize = 2;
const insertMargin = 10;
const aggregatedCountPerFrame = 50;
const domainMargin = 12;


let aggregatedCount = 0;
let currentMaxRadius = 0;
let isStop = false;
let cdt;


function start() {
    cdt = main.context.getImageData(0, 0, main.canvasWidth, main.canvasHeight);
    isStop = false;
    draw();

}

function stopAndClearCanvas() {
    isStop = true;

    main.context.clearRect(0, 0, main.canvas.width, main.canvas.height);
    main.context.fillStyle = 'rgba(255, 0, 0, 255)';
    main.context.arc(main.seedX, main.seedY, seedSize, 0, 2 * Math.PI);
    main.context.fill()
    aggregatedCount = 0;
    currentMaxRadius = 0;
    document.getElementById("pts").innerHTML = aggregatedCount;
    document.getElementById("size").innerHTML = currentMaxRadius;
    document.getElementById("fdim").innerHTML = "-";
    cdt = main.context.getImageData(0, 0, main.canvasWidth, main.canvasHeight);
}

function pause() {
    isStop = true;
}

function draw() {
    for (let i = 0; i < aggregatedCountPerFrame; i++) {

        let newPosition = new Point(0, 0);
        let startPosition = new Point(0, 0);
        let randCircularPosition = rand.getRandUniformCircularPosition(currentMaxRadius + insertMargin, main.seedX, main.seedY);
        startPosition.copy(randCircularPosition);
        let isNotAggregated = true;

        while (isNotAggregated) {

            if (currentMaxRadius > main.maxAggregateRadius)
                return;
            let jump = rand.getRandJump(main.horizontalDrift, main.verticalDrift);
            newPosition.sum(startPosition, jump)

            if (!isJumpWithinDomain(newPosition, currentMaxRadius + domainMargin)) {
                newPosition.copy(startPosition);

            }
            else {

                if (isAggregate(newPosition, cdt)) {
                    if (isGetAggregated()) {
                        drawPixel(startPosition, 255, 0, 0, 255, cdt);
                        let seed = new Point(main.seedX, main.seedY);
                        let currentAggregatedRadius = startPosition.distance(seed);

                        if (currentAggregatedRadius > currentMaxRadius) {
                            currentMaxRadius = currentAggregatedRadius;
                        }
                        aggregatedCount++;
                        isNotAggregated = false;
                    }
                    else {
                        newPosition.copy(startPosition);
                    }
                }

                else {
                    startPosition.copy(newPosition);
                }
            }
        }
    }
    if (!isStop) {
        updateCanvas(main.context, cdt);
        fractalDim.fractalDim(main.seedX, main.seedY, currentMaxRadius, cdt, isAggregate);
        document.getElementById("pts").innerHTML = aggregatedCount;
        document.getElementById("size").innerHTML = currentMaxRadius;
        window.requestAnimationFrame(draw);
    }
}
function isJumpWithinDomain(newPosition, maxR) {
    let seed = new Point(main.seedX, main.seedY);

    return (newPosition.distance(seed) <= maxR);
}

function isAggregate(position, canvasData) {
    let index = (position.x + position.y * main.canvasWidth) * 4;
    return canvasData.data[index] === 255;
}

function isGetAggregated() {
    return (rand.getRandUniformBool() < main.stickProbability);
}

function drawPixel(point, r, g, b, a, canvasData) {
    let index = (point.x + point.y * main.canvasWidth) * 4;
    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
}

function updateCanvas(ctx, canvasData) {
    ctx.putImageData(canvasData, 0, 0);
}

