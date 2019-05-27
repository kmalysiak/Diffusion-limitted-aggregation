'mode strict'

export{logger}

var verbose = false;

function logger(str) {
    if (verbose)
        console.log(str);
}