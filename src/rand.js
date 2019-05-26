'use strict'

export { initRandNum, myRand, getRandJump, getRandCircularPosition }
import * as utils from './utils';

var randNumCount = 100000;
var currentRand = 0;
var randNum = Array(randNumCount);

function initRandNum() {
    for (var i = 0; i < randNumCount; i++) {
        randNum[i] = Math.random();
    }
    utils.logger('Init rand num is finished!');
}

function myRand() {
    if (currentRand > randNumCount - 1)
        currentRand = -1;

    currentRand++;
    return randNum[currentRand];
}


function getRandRadian() {
    //utils.logger('Run now: getRandRadian');
    return ((rand.myRand() * Math.PI * 2.0));
}

function getRandCircularPosition(radius, centerX, centerY) {
    //utils.logger('Run now: getCircularPositionX');
    let randRadian = getRandRadian();

    return {
        posX: Math.floor(radius * Math.cos(randRadian)) + centerX,
        posY: Math.floor(radius * Math.sin(randRadian)) + centerY
    };
}


function getHorizontalRandJump(horizontalDrift) {
    utils.logger('Run now: getHorizontalRandJump');

    var prob = rand.myRand();
    //utils.logger('HORIZONTAl: prob:' + prob + ' horDrift:' + horizontalDrift);
    if (prob > horizontalDrift) return 1;
    else
        return -1;
}

function getVerticalRandJump(verticalDrift) {
    //utils.logger('Run now: getVerticalRandJump');
    var prob = rand.myRand();
    //utils.logger('Vertical: prob:' + prob + ' verDrift:' + verticalDrift);
    if (prob > verticalDrift) return 1;
    else
        return -1;
}

function getRandJump(horizontalDrift, verticalDrift) {
    //utils.logger('Run now: getRandJump');
    var xJump = 0;
    var yJump = 0;

    if (rand.myRand() < 0.5) {
        xJump = getHorizontalRandJump(horizontalDrift);
    }
    else {
        yJump = getVerticalRandJump(verticalDrift);
    }

    var jumps = {
        xJump: xJump,
        yJump: yJump
    };

    return jumps;
}