'use strict'

export { initRandNum, getRandUniformBool, getRandJump, getRandUniformCircularPosition }
import { Point } from './commonClasses';

const randBufferSize = 100000;
let currentRand = 0;
let randNum = Array(randBufferSize);
const unitJump = 1;

function initRandNum() {
    for (let i = 0; i < randBufferSize; i++) {
        randNum[i] = Math.random();
    }
}

function getRandUniformBool() {
    if (currentRand > randBufferSize - 1)
        currentRand = -1;

    currentRand++;
    return randNum[currentRand];
}

function getRandUniformRadian() {
    return getRandUniformBool() * Math.PI * 2.0;
}

function getRandUniformCircularPosition(radius, seed) {
    let randRadian = getRandUniformRadian();
    return new Point(Math.floor(radius * Math.cos(randRadian)) + seed.x, Math.floor(radius * Math.sin(randRadian)) + seed.y);
}


function getHorizontalRandJump(horizontalDrift) {
    if (getRandUniformBool() > horizontalDrift) return unitJump;
    else
        return -unitJump;
}

function getVerticalRandJump(verticalDrift) {
    if (getRandUniformBool() > verticalDrift) return unitJump;
    else
        return -unitJump;
}

function getRandJump(horizontalDrift, verticalDrift) {
    let jump = new Point(0, 0);

    if (getRandUniformBool() < 0.5) {
        jump.x = getHorizontalRandJump(horizontalDrift);
    }
    else {
        jump.y = getVerticalRandJump(verticalDrift);
    }
    return jump;
}