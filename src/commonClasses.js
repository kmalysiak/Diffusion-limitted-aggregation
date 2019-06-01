'use strict'

import { COPYFILE_FICLONE_FORCE } from "constants";

export { Point };

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(pt) {
        this.x += pt.x;
        this.y += pt.y;
    }
    addPair(x, y) {
        this.x += x;
        this.y += y;
    }

    subs(pt) {
        this.x -= pt.x;
        this.y -= pt.y;
    }

    copy(pt) {
        this.x = pt.x;
        this.y = pt.y;
    }

    copyPair(x, y) {
        this.x = x;
        this.y = y;
    }

    sum(a, b) {
        this.x = a.x + b.x
        this.y = a.y + b.y;
    }

    distanceSquare(pt){
        let dx = this.x - pt.x;
        let dy = this.y - pt.y;
        return  (dx*dx + dy*dy);
    }
    distance(pt){
        return Math.floor(Math.sqrt(this.distanceSquare(pt)));
    }

}