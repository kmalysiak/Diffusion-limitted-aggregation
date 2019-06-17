import {Point} from './commonClasses';
import * as rand from './rand';
import * as fractalDim from './fractalDim'


const insertMargin = 3;
const domainMargin = 5;
const maxStepsForParticle = 100000;
const particlesPerMessage = 10;

let currentMaxRadius = 0;
let maxAggregateRadiusAllowed;
let isStop = false;
let bigTable;
let seed;
let horizontalDrift;
let verticalDrift;
let stickProbability;

let aggregatedParticlesCount = 0;
let aggregatedPointRadii = [];
let aggregatedParticlesList = [];
let canvasSize;

onmessage = function (msg) {
    if (msg.data === 'init')
        runInit();
    else if (msg.data === 'start') {
        isStop = false;
        runSimulation();
    } else if (msg.data === 'stop') {
        isStop = true;
        runInit();
    } else if (msg.data === 'stop') {
        isStop = true;
    } else if (msg.data === 'continue' && !isStop)
        runSimulation();
    else if (Array.isArray(msg.data)) {
        if (msg.data[0] === 'paramsUpdate') {
            verticalDrift = msg.data[1].driftVertical;
            horizontalDrift = msg.data[1].driftHorizontal;
            stickProbability = msg.data[1].aggregationProbability;
        } else if (msg.data[0] === 'init') {
            canvasSize = msg.data[1].canvasSize;
            seed = msg.data[1].seed;
            maxAggregateRadiusAllowed = Math.floor(0.5 * Math.sqrt(canvasSize.x * canvasSize.x + canvasSize.y * canvasSize.y));
            runInit();

        }
    }
};

function runInit() {
    aggregatedPointRadii = [];
    aggregatedParticlesList = [];
    fractalDim.reset();
    rand.initRandNum();
    bigTable = new Array(canvasSize.x * canvasSize.y).fill(0);
    currentMaxRadius = 0;
    aggregatedParticlesCount = 0;

    drawPixel(new Point(seed.x, seed.y), canvasSize);
    drawPixel(new Point(seed.x + 1, seed.y + 1), canvasSize);
    drawPixel(new Point(seed.x, seed.y + 1), canvasSize);
    drawPixel(new Point(seed.x + 1, seed.y), canvasSize);
}


function runSimulation() {

    if (core())
        aggregatedParticlesCount++;

    if (aggregatedParticlesCount % particlesPerMessage === 0) {
        let fd = fractalDim.fractalDim2(aggregatedPointRadii, currentMaxRadius, maxAggregateRadiusAllowed);
        postMessage({part: JSON.stringify(aggregatedParticlesList), fd, aggregatedParticlesCount, currentMaxRadius});
        aggregatedParticlesList.length = 0;
    } else if (!isStop) {
        if (aggregatedParticlesCount % particlesPerMessage === 0)
            setTimeout(runSimulation, 0);
        else
            runSimulation();
    }

}

function core() {
    let isNotAggregated = true;
    let newPosition = new Point(0, 0);
    let startPosition = new Point(0, 0);
    let randCircularPosition = rand.getRandUniformCircularPosition(currentMaxRadius + insertMargin, seed);
    startPosition.copy(randCircularPosition);

    for (let doneSteps = 0; doneSteps < maxStepsForParticle; doneSteps++) {

        if (!isNotAggregated)
            return;
        if (currentMaxRadius >= maxAggregateRadiusAllowed) {
            isStop = true;
            return;
        }

        if (currentMaxRadius > maxAggregateRadiusAllowed)
            return;

        let jump = rand.getRandJump(horizontalDrift, verticalDrift);
        newPosition.sum(startPosition, jump);

        if (!isJumpWithinDomain(newPosition, currentMaxRadius + domainMargin, seed)) {
            newPosition.copy(startPosition);

        } else {

            if (isAggregate(newPosition, canvasSize)) {
                if (isGetAggregated()) {
                    drawPixel(startPosition, canvasSize);
                    aggregatedPointRadii.push(startPosition.distance(seed));
                    aggregatedParticlesList.push(newPosition);

                    if (aggregatedPointRadii[aggregatedParticlesCount] > currentMaxRadius)
                        currentMaxRadius = aggregatedPointRadii[aggregatedParticlesCount];
                    isNotAggregated = false;
                    return true;
                }

            } else {
                startPosition.copy(newPosition);
            }
        }
    }
    return false;
}

function isJumpWithinDomain(newPosition, maxR, seed) {
    return (newPosition.distanceSquare(seed) <= maxR * maxR);
}

function isAggregate(position, canvasSize) {
    let index = (position.x + position.y * canvasSize.x);
    return bigTable[index] === 1
}

function isGetAggregated() {
    return (rand.getRandUniformBool() < stickProbability);
}

function drawPixel(point, canvasSize) {
    let index = (point.x + point.y * canvasSize.x);
    bigTable[index] = 1;
}