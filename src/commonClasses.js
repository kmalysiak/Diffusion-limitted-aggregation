'use strict';

export {Point};

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    copy(pt) {
        this.x = pt.x;
        this.y = pt.y;
    }

    sum(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
    }

    distanceSquare(pt) {
        let dx = this.x - pt.x;
        let dy = this.y - pt.y;
        return (dx * dx + dy * dy);
    }

    distance(pt) {
        return Math.floor(Math.sqrt(this.distanceSquare(pt)));
    }

}