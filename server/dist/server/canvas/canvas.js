"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Window = void 0;
class Window {
    constructor(title, width, height) {
        Object.defineProperty(this, "title", {
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
        Object.defineProperty(this, "canvas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ctx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // 20px for the size of each cell
        Object.defineProperty(this, "CELL_SIZE", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 20
        });
        this.title = title;
        this.width = width;
        this.height = height;
        this.createCanvas();
    }
    createCanvas() {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 500;
        this.canvas.height = 500;
        document.body.appendChild(this.canvas);
    }
    drawWorld() {
        this.ctx.beginPath();
        // first draw rows
        for (let x = 0; x < this.width + 1; x++) {
            this.ctx.moveTo(this.CELL_SIZE * x, 0);
            // this will draw the line
            this.ctx.lineTo(this.CELL_SIZE * x, this.width * this.CELL_SIZE);
        }
        for (let y = 0; y < this.width + 1; y++) {
            this.ctx.moveTo(0, this.CELL_SIZE * y);
            this.ctx.lineTo(this.width * this.CELL_SIZE, this.CELL_SIZE * y);
        }
        this.ctx.stroke();
    }
}
exports.Window = Window;
// new Window('canvas', 12, 12);
//   const w = new Window("canvas", 12, 12);
//   w.drawWorld();
