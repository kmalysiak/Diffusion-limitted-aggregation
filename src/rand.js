'use strict'

export { initRandNum, getRandUniformBool, getRandJump, getRandUniformCircularPosition }
import * as utils from './utils';
import{Point} from './commonClasses';

let randBufferSize = 100000;
let currentRand = 0;
let randNum = Array(randBufferSize);

const unitJump = 1;

function initRandNum() {
    for (let i = 0; i < randBufferSize; i++) {
        randNum[i] = Math.random();
    }
    utils.logger('Init rand num is finished!');
}

function getRandUniformBool() {
    if (currentRand > randBufferSize - 1)
        currentRand = -1;

    currentRand++;
    return randNum[currentRand];
}

function getRandUniformRadian() {
    //utils.logger('Run now: getRandRadian');
    return ((getRandUniformBool() * Math.PI * 2.0));
}

function getRandUniformCircularPosition(radius, centerX, centerY) {
    //utils.logger('Run now: getCircularPositionX');
    let randRadian = getRandUniformRadian();
    let output = new Point(Math.floor(radius * Math.cos(randRadian)) + centerX, Math.floor(radius * Math.sin(randRadian)) + centerY);
    return output;
}


function getHorizontalRandJump(horizontalDrift) {
    utils.logger('Run now: getHorizontalRandJump');

    let prob = getRandUniformBool();
    //utils.logger('HORIZONTAl: prob:' + prob + ' horDrift:' + horizontalDrift);
    if (prob > horizontalDrift) return unitJump;
    else
        return -unitJump;
}

function getVerticalRandJump(verticalDrift) {
    //utils.logger('Run now: getVerticalRandJump');
    let prob = getRandUniformBool();
    //utils.logger('Vertical: prob:' + prob + ' verDrift:' + verticalDrift);
    if (prob > verticalDrift) return unitJump;
    else
        return -unitJump;
}

function getRandJump(horizontalDrift, verticalDrift) {
    //utils.logger('Run now: getRandJump');
    let xJump = 0;
    let yJump = 0;

    if (getRandUniformBool() < 0.5) {
        xJump = getHorizontalRandJump(horizontalDrift);
    }
    else {
        yJump = getVerticalRandJump(verticalDrift);
    }

    let jumps = {
        xJump: xJump,
        yJump: yJump
    };

    return jumps;
}