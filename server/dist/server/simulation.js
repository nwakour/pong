"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const matter_js_1 = __importDefault(require("matter-js"));
class Game {
    constructor() {
        Object.defineProperty(this, "engine", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ball", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "bars", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "walls", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "runner", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        console.log("Game created");
        this.engine = matter_js_1.default.Engine.create({ gravity: { x: 0, y: 0 } });
        this.walls["top"] = matter_js_1.default.Bodies.rectangle(640, -250, 1800, 500, { isStatic: true });
        this.walls["bottom"] = matter_js_1.default.Bodies.rectangle(640, 970, 1800, 500, { isStatic: true });
        this.walls["left"] = matter_js_1.default.Bodies.rectangle(-250, 360, 500, 1500, { isStatic: true });
        this.walls["right"] = matter_js_1.default.Bodies.rectangle(1530, 360, 500, 1500, { isStatic: true });
        this.ball = matter_js_1.default.Bodies.circle(640, 360, 10, { inertia: Infinity,
            friction: 0,
            frictionStatic: 0,
            frictionAir: 0,
            restitution: 1 });
        matter_js_1.default.Composite.add(this.engine.world, [this.ball, this.walls["top"], this.walls["bottom"], this.walls["left"], this.walls["right"]]);
        this.runner = matter_js_1.default.Runner.create({ isFixed: true, delta: 16.6666666667 });
    }
    addBar(id, x, y, width, height) {
        this.bars.set(id, [matter_js_1.default.Bodies.rectangle(x, y, width, height, { inertia: Infinity, friction: 0, frictionStatic: 0, frictionAir: 0, restitution: 1 }), 0]);
        matter_js_1.default.Composite.add(this.engine.world, this.bars.get(id)[0]);
    }
    removeBar(id) {
        console.log("Bar removed");
        matter_js_1.default.Composite.remove(this.engine.world, this.bars.get(id)[0]);
        this.bars.delete(id);
    }
}
exports.Game = Game;
