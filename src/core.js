import { Point } from './commonClasses';
import * as rand from './rand';
import * as fractalDim from './fractalDim'
// import * as main from './main';

let currentMaxRadius = 0;
const insertMargin = 3;
const domainMargin = 5;
const maxStepsForParticle = 100000;
let maxAggregateRadiusAllowed = 400;
let isStop = false;
let bigTable;
let seed = new Point(400, 400);
let horizontalDrift = 0.5;
let verticalDrift = 0.5;
let stickProbability = 1;




let canvasSize = new Point(800, 800);

onmessage = function (msg) {
    // eslint-disable-next-line no-console
    //console.log('received command:' + msg.data);
    if (msg.data == 'init')
        runInit();

    if (msg.data == 'start') {
         isStop = false;
        runSimulation();
       
    }

    if (msg.data == 'stop') {
        isStop = true;
    }
    if(msg.data == 'continue' && !isStop)
        runSimulation();
    if(Array.isArray(msg.data)){
        if(msg.data[0] =='paramsUpdate'){
            verticalDrift = msg.data[1].verticalDrift;
            horizontalDrift = msg.data[1].horizontalDrift;
            stickProbability = msg.data[1].stickProbability;
            console.log(verticalDrift, horizontalDrift, stickProbability);
        }
    }

};

function runInit() {
    rand.initRandNum();
    console.log('I am alive!!');

    let canvasSize = new Point(800, 800);
    bigTable = new Array(800 * 800).fill(0);
    // console.log(rand.getRandUniformCircularPosition(10, new Point(400, 400)));
    drawPixel(new Point(400, 400), canvasSize);
    drawPixel(new Point(401, 401), canvasSize);
    drawPixel(new Point(400, 401), canvasSize);
    drawPixel(new Point(401, 400), canvasSize);
}

let aggregatedParticlesCount = 0;
let aggregatedPointRadiuses = [];
let aggregatedParticlesList = [];
let particlesPerMessage = 1;

function runSimulation() {
    //maxAggregateRadius = Math.floor(Math.min(canvasSize.x, canvasSize.y) / 2);
    if (core())
        aggregatedParticlesCount++;

    if (aggregatedParticlesCount % particlesPerMessage === 0) {
        let fd = fractalDim.fractalDim2(aggregatedPointRadiuses,currentMaxRadius, maxAggregateRadiusAllowed );
        postMessage({ part: JSON.stringify(aggregatedParticlesList), fd, aggregatedParticlesCount,  currentMaxRadius });
        aggregatedParticlesList.length = 0;
    }
    else
        if (!isStop) {
            if (aggregatedParticlesCount % particlesPerMessage === 0)
                setTimeout(runSimulation, 0);
            else
                runSimulation();
        }

}

function core() {
    //  console.log('core on the run for particle:' + aggregatedParticlesCount);
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
        newPosition.sum(startPosition, jump)

        if (!isJumpWithinDomain(newPosition, currentMaxRadius + domainMargin, seed)) {
            newPosition.copy(startPosition);

        }
        else {

            if (isAggregate(newPosition, canvasSize)) {
                if (isGetAggregated()) {
                    drawPixel(startPosition, canvasSize);
                    aggregatedPointRadiuses.push(startPosition.distance(seed));
                    aggregatedParticlesList.push(newPosition);
                    // console.log(newPosition, aggregatedParticlesCount,  aggregatedPointRadiuses, currentMaxRadius);

                    if (aggregatedPointRadiuses[aggregatedParticlesCount] > currentMaxRadius)
                        currentMaxRadius = aggregatedPointRadiuses[aggregatedParticlesCount];
                    isNotAggregated = false;
                    return true;
                }

            }
            else {
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