"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ball = exports.simulation = void 0;
class simulation {
    constructor(server, width, height) {
        Object.defineProperty(this, "server", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // private lastframe : number | null;
        Object.defineProperty(this, "width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "balls", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        this.server = server;
        // this.lastframe = null;
        this.width = width;
        this.height = height;
        setInterval(this.draw.bind(this), 1000 / 60);
    }
    add_ball(ball) {
        this.balls[ball.id] = ball;
    }
    // public keyup(id: string ,move: string|null) {
    //     if (this.balls[id].mymove === move) {
    //         this.balls[id].mymove = null;
    //     }
    // }
    // public keydown(id: string, move: string|null) {
    //     this.balls[id].mymove = move;
    // }
    draw() {
        // if (this.lastframe === null) {
        //     this.lastframe = Date.now();
        //     return;
        // }
        // const diff = Date.now() - this.lastframe;
        // this.lastframe = Date.now();
        for (let key in this.balls) {
            this.balls[key].move(this.server, this.height, this.width);
        }
    }
}
exports.simulation = simulation;
class Ball {
    constructor(id, x, y, radius, speed) {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "xpos", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ypos", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "radius", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "speed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "nb", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.id = id;
        this.xpos = x;
        this.ypos = y;
        this.radius = radius;
        this.speed = speed;
        this.dx = 1 * this.speed;
        this.dy = 1 * this.speed;
        this.nb = 0;
    }
    move(server, height, width) {
        let flag = false;
        if (this.events[this.nb] === undefined)
            return;
        if (this.events[this.nb][3]['ArrowDown'] === 1) {
            if (this.ypos + this.radius + this.dy * this.events[this.nb][2] < height) {
                this.ypos += this.dy * this.events[this.nb][2];
            }
            else {
                this.ypos = height - this.radius;
            }
            flag = true;
        }
        if (this.events[this.nb][3]['ArrowUp'] === 1) {
            if (this.ypos - this.radius - this.dy * this.events[this.nb][2] > 0) {
                this.ypos -= this.dy * this.events[this.nb][2];
            }
            else {
                this.ypos = this.radius;
            }
            flag = true;
        }
        if (this.events[this.nb][3]['ArrowLeft'] === 1) {
            if (this.xpos - this.radius - this.dx * this.events[this.nb][2] > 0) {
                this.xpos -= this.dx * this.events[this.nb][2];
            }
            else {
                this.xpos = this.radius;
            }
            flag = true;
        }
        if (this.events[this.nb][3]['ArrowRight'] === 1) {
            if (this.xpos + this.radius + this.dx * this.events[this.nb][2] < width) {
                this.xpos += this.dx * this.events[this.nb][2];
            }
            else {
                this.xpos = width - this.radius;
            }
            flag = true;
        }
        if (flag) {
            this.events[this.nb][0] = this.xpos;
            this.events[this.nb][1] = this.ypos;
            server.emit('update', this.id, this.xpos, this.ypos, this.nb);
            ++this.nb;
        }
    }
}
exports.Ball = Ball;
