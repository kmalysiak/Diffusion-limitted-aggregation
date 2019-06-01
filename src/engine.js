'use strict'

export { start, pause, stopAndClearCanvas };
import * as rand from './rand';
import * as main from './main';
import * as fractalDim from './fractalDim';
import { Point } from './commonClasses';

const seedSize = 2;
const insertMargin = 3;
const aggregatedCountPerFrame = 70;
const domainMargin = 5;


let totalAggregatedCount = 0;
let currentMaxRadius = 0;
let isStop = false;
let cdt;


function start() {
    cdt = main.context.getImageData(0, 0, main.canvasSize.x, main.canvasSize.y);
    isStop = false;
    draw();

}

function stopAndClearCanvas() {
    isStop = true;

    main.context.clearRect(0, 0, main.canvas.width, main.canvas.height);
    main.context.fillStyle = 'rgba(255, 0, 0, 255)';
    main.context.arc(main.seed.x, main.seed.y, seedSize, 0, 2 * Math.PI);
    main.context.fill()
    totalAggregatedCount = 0;
    currentMaxRadius = 0;
    document.getElementById("pts").innerHTML = totalAggregatedCount;
    document.getElementById("size").innerHTML = currentMaxRadius;
    document.getElementById("fdim").innerHTML = "-";
    cdt = main.context.getImageData(0, 0, main.canvasSize.xh, main.canvasSize.y);
}

function pause() {
    isStop = true;
}

function draw() {
    let aggregatedPointRadiuses = [];
    for (let i = 0; i < aggregatedCountPerFrame; i++) {

        let newPosition = new Point(0, 0);
        let startPosition = new Point(0, 0);
        let randCircularPosition = rand.getRandUniformCircularPosition(currentMaxRadius + insertMargin, main.seed);
        startPosition.copy(randCircularPosition);
        let isNotAggregated = true;


        while (isNotAggregated) {

            if (currentMaxRadius > main.maxAggregateRadius)
                return;
            let jump = rand.getRandJump(main.horizontalDrift, main.verticalDrift);
            newPosition.sum(startPosition, jump)

            if (!isJumpWithinDomain(newPosition, currentMaxRadius + domainMargin, main.seed)) {
                newPosition.copy(startPosition);

            }
            else {

                if (isAggregate(newPosition, cdt, main.canvasSize)) {
                    if (isGetAggregated()) {
                        drawPixel(startPosition, 255, 0, 0, 255, cdt, main.canvasSize);
                        aggregatedPointRadiuses.push(startPosition.distance(main.seed));

                        if (aggregatedPointRadiuses[i] > currentMaxRadius)
                            currentMaxRadius = aggregatedPointRadiuses[i];

                        totalAggregatedCount++;
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
        fractalDim.fractalDim2(aggregatedPointRadiuses, currentMaxRadius);
        document.getElementById("pts").innerHTML = totalAggregatedCount;
        document.getElementById("size").innerHTML = currentMaxRadius;
        window.requestAnimationFrame(draw);
    }
}
function isJumpWithinDomain(newPosition, maxR, seed) {
    return (newPosition.distanceSquare(seed) <= maxR * maxR);
}

function isAggregate(position, canvasData, canvasSize) {
    let index = (position.x + position.y * canvasSize.x) * 4;
    return canvasData.data[index] === 255;
}

function isGetAggregated() {
    return (rand.getRandUniformBool() < main.stickProbability);
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

