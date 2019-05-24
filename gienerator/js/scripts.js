"use strict";

function startCalculation(){
    //console.log("Start");
    console.clear();
    var count = document.getElementById("count").value;
    var stdTime = document.getElementById("stdTime");
    var imprTime = document.getElementById("imprTime");
    var stdAv = document.getElementById("stdAv");
    var myAv = document.getElementById("myAv");
    var shiftEng = shiftEngineGen();
    var my =  wrapper(count, shiftEng);
    var std = wrapper(count, stdEngine);
    stdTime.value = std.time;
    imprTime.value = my.time;
    stdAv.value = std.average;
    myAv.value = my.average;
}


function stdEngine(){
   return (Math.random() >= 0.5)
}

function wrapper(count, method){
    var a = performance.now();
    var av = 0;
    for(var i=0; i<count; i++){
        av+= method();
    }
    var b = performance.now();
    av = av / count;
return  {time: (b - a),
         average: av};  
}

function shiftEngineGen(){ 
    var raw = Math.random() * 2147483647; 
    return function shiftEngine(){
        if(raw  === 0){
            raw = Math.random() * 2147483647;
        }
        raw = raw >> 1;
        return  raw & 1;
        }   
}




