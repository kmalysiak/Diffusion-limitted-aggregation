'mode strict'

export{logger}

var verbose = true;

function logger(str) {
    if (verbose)
        console.log(str);
}