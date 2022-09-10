"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.Bar = exports.Ball = void 0;
const matter_js_1 = __importDefault(require("matter-js"));
class Ball {
    constructor(x, y, radius) {
        Object.defineProperty(this, "ball", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "r", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.r = radius;
        this.ball = matter_js_1.default.Bodies.polygon(x, y, 6, radius, { inertia: Infinity,
            friction: 0,
            frictionStatic: 0,
            frictionAir: 0,
            restitution: 1 });
    }
}
exports.Ball = Ball;
class Bar {
    constructor(x, y, width, height) {
        Object.defineProperty(this, "bar", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
        // public key: { [x: string]: number } = {};
        Object.defineProperty(this, "mov", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "last", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.width = width;
        this.height = height;
        this.bar = matter_js_1.default.Bodies.rectangle(x, y, width, height, { isStatic: true });
        // this.key["ArrowDown"] = 0;
        // this.key["ArrowUp"] = 0;
        this.mov = 0;
        this.last = 0;
    }
}
exports.Bar = Bar;
class Game {
    constructor() {
        Object.defineProperty(this, "engine", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // public ball : Ball;
        Object.defineProperty(this, "bar", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "walls", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "start", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "runner", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lastframe", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.engine = matter_js_1.default.Engine.create();
        this.start = false;
        // this.ball = new Ball(300, 300, 20);
        this.bar = new Bar(400, 300, 10, 100);
        this.engine.gravity.y = 0;
        this.walls["top"] = matter_js_1.default.Bodies.rectangle(1280 / 2, 0, 1280, 10, { isStatic: true });
        this.walls["bottom"] = matter_js_1.default.Bodies.rectangle(1280 / 2, 720, 1280, 10, { isStatic: true });
        this.walls["left"] = matter_js_1.default.Bodies.rectangle(0, 720 / 2, 10, 720, { isStatic: true });
        this.walls["right"] = matter_js_1.default.Bodies.rectangle(1280, 720 / 2, 10, 720, { isStatic: true });
        // Matter.World.add(this.engine.world, [this.ball.ball, this.bar.bar, this.walls["top"], this.walls["bottom"], this.walls["left"], this.walls["right"]]);
        matter_js_1.default.World.add(this.engine.world, [this.bar.bar, this.walls["top"], this.walls["bottom"], this.walls["left"], this.walls["right"]]);
        this.runner = matter_js_1.default.Runner.create();
        matter_js_1.default.Runner.run(this.runner, this.engine);
        this.lastframe = null;
        // Matter.Body.setVelocity(this.ball.ball, {x: -10, y: 0});
        // setInterval(this.update.bind(this), 1000/60);
    }
}
exports.Game = Game;
