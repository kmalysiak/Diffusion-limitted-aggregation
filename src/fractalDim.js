'use strict'

let mass;

export { fractalDim2 }

const isR2Calculation = false;

function fractalDim2(newParticleDist, maxR, maxSize) {

    if(mass === undefined){
        mass = new Array(maxSize).fill(0);
    }

    for (let i = 0; i < newParticleDist.length; i++)
        mass[newParticleDist[i]]++;

    let logSize = [];
    let logMass = [];
    let counter = 0;
    let totalMass = 0;
    for (let i = 1; i < maxR; i++) {
        if (mass[i] > 0) {
            totalMass += mass[i]
            logSize[counter] = Math.log(i);
            logMass[counter] = Math.log(totalMass);
            counter++;
        }
    }
    return linearRegression(logMass, logSize).slope;
}

function linearRegression(y, x) {

    let lr = {};
    let n = y.length;
    let sum_x = 0;
    let sum_y = 0;
    let sum_xy = 0;
    let sum_xx = 0;
    let sum_yy = 0;

    for (let i = 0; i < y.length; i++) {

        sum_x += x[i];
        sum_y += y[i];

        sum_xy += (x[i] * y[i]);
        sum_xx += (x[i] * x[i]);
        sum_yy += (y[i] * y[i]);
    }
    if (isR2Calculation) {
        lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);
    }
    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
    return lr
}
