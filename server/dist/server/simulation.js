"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.Bar = exports.Ball = exports.Snap = void 0;
const matter_js_1 = __importDefault(require("matter-js"));
class Snap {
    constructor(check_nb, x, y, vx, vy, mov, t) {
        Object.defineProperty(this, "check_nb", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "y", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "vx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "vy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mov", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "t", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.check_nb = check_nb;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mov = mov;
        this.t = t;
    }
}
exports.Snap = Snap;
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
        Object.defineProperty(this, "x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "y", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pending_events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "check_nb", {
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
        this.x = x;
        this.y = y;
        this.r = radius;
        this.ball = matter_js_1.default.Bodies.polygon(x, y, 6, radius, { inertia: Infinity,
            friction: 0,
            frictionStatic: 0,
            frictionAir: 0,
            restitution: 1 });
        this.check_nb = 0;
        this.lastframe = null;
    }
    reset() {
        console.log("ball reset");
        matter_js_1.default.Body.setVelocity(this.ball, { x: this.x - this.ball.position.x, y: this.y - this.ball.position.y });
        matter_js_1.default.Body.setPosition(this.ball, { x: this.x, y: this.y });
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
        Object.defineProperty(this, "x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "y", {
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
        Object.defineProperty(this, "key", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "pending_events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
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
        Object.defineProperty(this, "check_nb", {
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
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.bar = matter_js_1.default.Bodies.rectangle(x, y, width, height, { isStatic: true });
        this.key["ArrowDown"] = 0;
        this.key["ArrowUp"] = 0;
        this.mov = 0;
        this.last = 0;
        this.check_nb = 0;
        this.lastframe = null;
    }
    reset() {
        console.log("reset");
        this.mov = 0;
        this.last = 0;
        this.check_nb = 0;
        this.lastframe = null;
        this.key["ArrowDown"] = 0;
        this.key["ArrowUp"] = 0;
        matter_js_1.default.Body.setVelocity(this.bar, { x: this.x - this.bar.position.x, y: this.y - this.bar.position.y });
        matter_js_1.default.Body.setPosition(this.bar, { x: this.x, y: this.y });
        matter_js_1.default.Body.setVelocity(this.bar, { x: 0, y: 0 });
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
        Object.defineProperty(this, "inter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "inter_updates", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        console.log("Game created");
        this.engine = matter_js_1.default.Engine.create();
        // this.bar = new Bar(50, 300, 10, 100);
        this.engine.gravity.y = 0;
        this.walls["top"] = matter_js_1.default.Bodies.rectangle(1280 / 2, 0, 1280, 10, { isStatic: true });
        this.walls["bottom"] = matter_js_1.default.Bodies.rectangle(1280 / 2, 720, 1280, 10, { isStatic: true });
        this.walls["left"] = matter_js_1.default.Bodies.rectangle(0, 720 / 2, 10, 720, { isStatic: true });
        this.walls["right"] = matter_js_1.default.Bodies.rectangle(1280, 720 / 2, 10, 720, { isStatic: true });
        this.ball = new Ball(1280 / 2, 720 / 2, 10);
        matter_js_1.default.Composite.add(this.engine.world, [this.walls["top"], this.walls["bottom"], this.walls["left"], this.walls["right"]]);
        this.runner = matter_js_1.default.Runner.create();
        matter_js_1.default.Runner.run(this.runner, this.engine);
        // setInterval(this.update.bind(this), 1000/60);
    }
    addBar(id, x, y, width, height) {
        console.log("Bar added");
        this.bars.set(id, new Bar(x, y, width, height));
        matter_js_1.default.Composite.add(this.engine.world, this.bars.get(id).bar);
    }
    removeBar(id) {
        console.log("Bar removed");
        matter_js_1.default.Composite.remove(this.engine.world, this.bars.get(id).bar);
        this.bars.delete(id);
    }
    start() {
        console.log("Game started");
        for (const bar of this.bars.values()) {
            bar.reset();
        }
        this.ball.reset();
        matter_js_1.default.World.add(this.engine.world, this.ball.ball);
    }
    clear() {
        console.log("Clear");
        for (const bar of this.bars.values()) {
            matter_js_1.default.Composite.remove(this.engine.world, bar.bar);
        }
        this.bars.clear();
        matter_js_1.default.Composite.remove(this.engine.world, this.walls["top"]);
        matter_js_1.default.Composite.remove(this.engine.world, this.walls["bottom"]);
        matter_js_1.default.Composite.remove(this.engine.world, this.walls["left"]);
        matter_js_1.default.Composite.remove(this.engine.world, this.walls["right"]);
        matter_js_1.default.Composite.remove(this.engine.world, this.ball.ball);
        this.walls = {};
        matter_js_1.default.Runner.stop(this.runner);
    }
}
exports.Game = Game;
