'use strict'

export{initRandNum, myRand}

var randNumCount = 100000;
var currentRand = 0;
var randNum = Array(randNumCount);

function initRandNum() {
    for (var i = 0; i < randNumCount; i++) {
        randNum[i] = Math.random();
    }
    console.log('finished!');
}

function myRand() {
    if (currentRand > randNumCount-1)
        currentRand = -1;
    
    currentRand++;
    return randNum[currentRand];
}